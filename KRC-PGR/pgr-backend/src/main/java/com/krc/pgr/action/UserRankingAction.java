package com.krc.pgr.action;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.Question;
import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.SourceFileName;
import com.krc.pgr.response.QuestionWithPasswordResponse;
import com.krc.pgr.response.RankingResponse;
import com.krc.pgr.response.ViewOtherUserAnswerResponse;
import com.krc.pgr.response.ViewAnswerResponse;
import com.krc.pgr.util.Converter;
import com.krc.pgr.util.FileManage;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class UserRankingAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    public RankingResponse ranking(String question_id_str, Map<String, Object> getParams) {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return RankingResponse.notFoundResponse();
        }

        String sql = "select question_title, view_password_hash, private_answer_mode from t_questions where question_id = ? and release_flag = true;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id);
        if (list.size() == 0) {
            return RankingResponse.notFoundResponse();
        }

        String view_password_hash = (String) list.get(0).get("view_password_hash");
        if (view_password_hash != null && !session.isViewingQuestion(question_id)) {
            return RankingResponse.passwordRequiredResponse();
        }

        boolean private_answer_mode = (boolean) list.get(0).get("private_answer_mode");
        if (private_answer_mode == true) {
            return RankingResponse.privateAnswerResponse();
        }

        String question_title = (String) list.get(0).get("question_title");

        String sort = (String) getParams.get("sort");
        if ("chars".equals(sort)) {
            sort = "chars_count asc, min_time asc";
        } else {
            sort = "min_time asc, chars_count asc";
        }

        sql = "select * from v_ranking where question_id = ? order by score desc, " + sort + " limit 10";
        list = jdbc.queryForList(sql, question_id);

        return new RankingResponse(question_title, list);
    }

// TODO
//    public RankingResponse rankingWithPassword(String question_id_str, Map<String, Object> postParams) {
//        int question_id;
//        try {
//            question_id = Integer.parseInt(question_id_str);
//        } catch (Exception e) {
//            return RankingResponse.notFoundResponse();
//        }
//
//        String view_password = (String) postParams.get("view_password");
//        String view_password_hash = PasswordManage.hash(view_password);
//
//        String sql = "select * from f_questions(?) where release_flag = true and question_id = ? and view_password_hash = ?;";
//
//        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id, view_password_hash);
//        if (list.size() == 0) {
//            return new RankingResponse();
//        }
//
//        session.setViewingQuestion_id(question_id);
////        return new RankingResponse(new (list.get(0)));
//    }

    public ViewOtherUserAnswerResponse viewAnswer(String question_id_str, String user_id_str) throws IOException, SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new ViewOtherUserAnswerResponse();
        }

        int user_id;
        try {
            user_id = Integer.parseInt(user_id_str);
        } catch (Exception e) {
            return new ViewOtherUserAnswerResponse();
        }

        String sql = "select view_password_hash is not null as password_required from t_questions where question_id = ? and release_flag = true and private_answer_mode = false;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id);

        if (list.size() == 0) {
            return new ViewOtherUserAnswerResponse();
        }

        boolean password_required = (boolean) list.get(0).get("password_required");
        if (password_required == true && session.isViewingQuestion(question_id) == false) {
            return new ViewOtherUserAnswerResponse();
        }

        sql = "select * from v_answers where question_id = ? and user_id = ?;";
        list = jdbc.queryForList(sql, question_id, user_id);

        if (list.size() == 0) {
            return new ViewOtherUserAnswerResponse();
        }

        Map<String, Object> answer = list.get(0);

        String dir = FileManage.generateSubmitFolderDirectory(question_id, user_id);
        Language select_language = Language.valueOf((Integer) answer.get("select_language"));
        String fn = SourceFileName.search(select_language).getFileName();
        String source_code = FileManage.readFile(dir + fn);

        int exec_count = (int) answer.get("exec_count");
        Integer[] exec_statuses = Converter.castPgArray_int(answer.get("exec_statuses"));
        Integer[] exec_times = Converter.castPgArray_int(answer.get("exec_times"));
        List<Map<String, Object>> executions = new ArrayList<>();
        for (int i = 0; i < exec_count; i++) {
            Map<String, Object> execution = new HashMap<>();

            String outputFileName = "output" + i + ".txt";
            String output = FileManage.readFile(dir + outputFileName);

            execution.put("output", output);
            execution.put("exec_status_id", exec_statuses[i]);
            execution.put("exec_time", exec_times[i]);
            executions.add(execution);
        }

        return new ViewOtherUserAnswerResponse(answer, select_language, source_code, executions);
    }
}

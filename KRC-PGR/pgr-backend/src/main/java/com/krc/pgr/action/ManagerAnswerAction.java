package com.krc.pgr.action;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.DLAnswerBean;
import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.SourceFileName;
import com.krc.pgr.response.DownloadAnswersResponse;
import com.krc.pgr.response.ViewAnswerDetailResponse;
import com.krc.pgr.response.ViewAnswersResponse;
import com.krc.pgr.util.Converter;
import com.krc.pgr.util.FileManage;
import com.krc.pgr.util.SessionManage;

@Component
public class ManagerAnswerAction {
    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    NamedParameterJdbcTemplate npjdbc;

    @Autowired
    SessionManage session;

    public ViewAnswersResponse viewAnswers(String question_id_str) throws SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new ViewAnswersResponse();
        }

        String sql = "select question_title, input_judge, output_judge from t_questions where user_id = ? and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id);
        if (list.size() == 0) {
            // is not my question
            return new ViewAnswersResponse();
        }

        String question_title = (String) list.get(0).get("question_title");
        String[] input_judge = Converter.castPgArray_str(list.get(0).get("input_judge"));
        String[] output_judge = Converter.castPgArray_str(list.get(0).get("output_judge"));

        sql = "select * from v_answers where question_id = ?;";
        list = jdbc.queryForList(sql, question_id);

        return new ViewAnswersResponse(question_title, input_judge, output_judge, list);
    }

    public DownloadAnswersResponse downloadAnswers(String question_id_str, Map<String, Object> postParams) throws IOException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new DownloadAnswersResponse();
        }

        String sql = "select question_id from t_questions where user_id = ? and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id);
        if (list.size() == 0) {
            // is not my question
            return new DownloadAnswersResponse();
        }

        @SuppressWarnings("unchecked")
        List<Integer> dl_users = (List<Integer>) postParams.get("dl_users");

        sql = "select * from v_answers where question_id = :question_id and user_id in (:dl_users)";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("question_id", question_id);
        params.addValue("dl_users", dl_users);
        list = npjdbc.queryForList(sql, params);

        List<DLAnswerBean> answers = new ArrayList<>();

        for (Map<String, Object> map : list) {
            answers.add(new DLAnswerBean(map, question_id));
        }

        return new DownloadAnswersResponse(answers);
    }

    public ViewAnswerDetailResponse viewAnswer(String question_id_str, String user_id_str) throws IOException, SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new ViewAnswerDetailResponse();
        }

        int user_id;
        try {
            user_id = Integer.parseInt(user_id_str);
        } catch (Exception e) {
            return new ViewAnswerDetailResponse();
        }

        String sql = "select * from v_answers where user_id = ? and question_id =? and q_poster_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, user_id, question_id, session.getLoginUser().getUser_id());
        if (list.size() == 0) {
            return new ViewAnswerDetailResponse();
        }

        Map<String, Object> answer = list.get(0);
        Language select_language = Language.valueOf((Integer) answer.get("select_language"));
        String sourceFileName = SourceFileName.search(select_language).getFileName();
        String dir = FileManage.generateSubmitFolderDirectory(question_id, user_id);

        String source_code = FileManage.readFile(dir + sourceFileName);

        Integer[] exec_statuses = Converter.castPgArray_int(answer.get("exec_statuses"));
        Integer[] exec_times = Converter.castPgArray_int(answer.get("exec_times"));

        List<Map<String, Object>> executions = new ArrayList<>();
        int exec_count = (int) answer.get("exec_count");
        for (int i = 0; i < exec_count; i++) {
            Map<String, Object> execution = new HashMap<>();

            String outputFileName = "output" + i + ".txt";
            String output = FileManage.readFile(dir + outputFileName);

            execution.put("output", output);
            execution.put("exec_status_id", exec_statuses[i]);
            execution.put("exec_time", exec_times[i]);
            executions.add(execution);
        }

        return new ViewAnswerDetailResponse(answer, source_code, executions);
    }
}

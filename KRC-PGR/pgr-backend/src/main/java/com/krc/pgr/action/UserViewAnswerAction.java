package com.krc.pgr.action;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.SourceFileName;
import com.krc.pgr.response.ViewAnswerResponse;
import com.krc.pgr.util.FileManage;
import com.krc.pgr.util.SessionManage;

@Component
public class UserViewAnswerAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    public ViewAnswerResponse viewAnswer(String question_id_str) throws IllegalArgumentException, IOException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new ViewAnswerResponse();
        }

        int user_id = session.getLoginUser().getUser_id();

        String sql = "select select_language, rows_count, chars_count, question_title, to_char(a.insert_timestamp, 'YYYY/MM/DD HH24:MI:SS') as insert_datetime from t_answers as a inner join t_questions as q on a.question_id = q.question_id where a.question_id = ? and a.user_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id, user_id);

        if (list.size() == 0) {
            return new ViewAnswerResponse();
        }

        Map<String, Object> answer = list.get(0);
        Integer select_language = (Integer) answer.get("select_language");
        int rows_count = (int) answer.get("rows_count");
        int chars_count = (int) answer.get("chars_count");
        String timestamp = (String) answer.get("insert_datetime");
        String question_title = (String) answer.get("question_title");

        String source_code = FileManage.readFile(FileManage.generateSubmitFolderDirectory(question_id, user_id) + "\\" + SourceFileName.search(Language.valueOf(select_language)).getFileName());

        sql = "select exec_time, exec_status_id from t_executions where question_id = ? and user_id = ? order by exec_number;";
        list = jdbc.queryForList(sql, question_id, user_id);

        if (list.size() == 0) {
            return new ViewAnswerResponse(question_title, select_language, rows_count, chars_count, timestamp, source_code);
        }

        return new ViewAnswerResponse(question_title, select_language, rows_count, chars_count, timestamp, source_code, list);
    }
}

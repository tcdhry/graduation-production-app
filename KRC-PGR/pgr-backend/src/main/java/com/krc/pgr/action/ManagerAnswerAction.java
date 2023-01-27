package com.krc.pgr.action;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.response.ViewAnswersResponse;
import com.krc.pgr.util.SessionManage;

@Component
public class ManagerAnswerAction {
    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    SessionManage session;

    public ViewAnswersResponse viewAnswers(String question_id_str) throws SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new ViewAnswersResponse();
        }

        String sql = "select question_title from t_questions where user_id = ? and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id);
        if (list.size() == 0) {
            // is not my question
            return new ViewAnswersResponse();
        }

        String question_title = (String) list.get(0).get("question_title");

        sql = "select * from v_answers where question_id = ?;";
        list = jdbc.queryForList(sql, question_id);

        return new ViewAnswersResponse(question_title, list);
    }
}

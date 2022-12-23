package com.krc.pgr.action;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.postgresql.jdbc.PgArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.constant.Language;
import com.krc.pgr.response.ExecConfirmResponse;
import com.krc.pgr.util.SessionManage;

@Component
public class UserExecQuestionAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    NamedParameterJdbcTemplate npjdbc;

    public ExecConfirmResponse execConfirm(String question_id_str, Map<String, Object> postParams) throws SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            // question not found
            return null;
        }

        if (!session.isViewingQuestion(question_id)) {
            // not viewing session
            return null;
        }

        String source_code = (String) postParams.get("source_code");
        if ("".equals(source_code)) {
            // source code not input
            return null;
        }

        Language select_language;
        try {
            select_language = Language.valueOf(Integer.parseInt((String) postParams.get("select_language")));
        } catch (Exception e) {
            // language not found
            return null;
        }

        String sql = "select inputs, outputs, language_designation from t_questions where release_flag = true and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id);

        if (list.size() == 0) {
            // question not found
            return null;
        }

        Map<String, Object> question = list.get(0);

        Integer language_designation = (Integer) question.get("language_designation");
        if (language_designation != null && language_designation != select_language.getId()) {
            // 言語指定があり、選択言語が違う場合
            return null;
        }

        String[] inputs = (String[]) ((PgArray) question.get("inputs")).getArray();
        String[] outputs = (String[]) ((PgArray) question.get("outputs")).getArray();

        for (int i = 0; i < 3; i++) {
            
        }

        return null;
    }

    public ExecConfirmResponse answerConfirm(String question_id_str, Map<String, Object> postParams) {

        return null;
    }

}

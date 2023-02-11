package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import com.krc.pgr.bean.ExamBean;
import com.krc.pgr.response.GetMyExamResponse;
import com.krc.pgr.response.PostExamResponse;
import com.krc.pgr.response.SuccessFlagResponse;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Service
public class ManagerExamAction {
    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private NamedParameterJdbcTemplate npjdbc;

    @Autowired
    private SessionManage session;

    public PostExamResponse postExam(Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * フロントに従えばここでエラーは起きないので、詳細なエラー情報は返さない
         */
        String exam_title = postParams.get("exam_title").toString();
        String description = postParams.get("description").toString();
        String password = postParams.get("password").toString();
        String password_check = postParams.get("password_check").toString();
        boolean release_flag = (boolean) postParams.get("release_flag");
        @SuppressWarnings("unchecked")
        List<Integer> question_ids = (List<Integer>) postParams.get("question_ids");
        @SuppressWarnings("unchecked")
        List<Integer> allocate_scores = (List<Integer>) postParams.get("allocate_scores");

        if ("".equals(exam_title) == true) {
            return new PostExamResponse();
        }
        if (exam_title.length() > 100) {
            return new PostExamResponse();
        }

        if (description.length() > 1000) {
            return new PostExamResponse();
        }

        if ("".equals(password) == true) {
            return new PostExamResponse();
        }

        if (password.equals(password_check) == false) {
            return new PostExamResponse();
        }
        String password_hash = PasswordManage.hash(password);

        String sql = "select * from t_questions where user_id != :user_id and question_id in (:question_ids);";
        MapSqlParameterSource sqlParamsMap = new MapSqlParameterSource();
        sqlParamsMap.addValue("question_ids", question_ids);
        sqlParamsMap.addValue("user_id", session.getLoginUser().getUser_id());

        List<Map<String, Object>> list = npjdbc.queryForList(sql, sqlParamsMap);
        if (list.size() != 0) {
            return new PostExamResponse();
        }

        /**
         * 途中での失敗を拾うためにトランザクションを開始
         * executeでトランザクションを扱うのは非推奨らしいけど面倒なのでこのままで
         */
        jdbc.execute("begin transaction;");

        try {
            sql = "insert into t_exams(exam_title, description, user_id, insert_timestamp, uuid, release_flag, password_hash) values(?, ?, ?, current_timestamp, uuid_generate_v4(), ?, ?);";
            Map<String, Object> keys = insertAndGetGeneratedColumns(sql, new Object[] { exam_title, description, session.getLoginUser().getUser_id(), release_flag, password_hash });
            int exam_id = (int) keys.get("exam_id");
            String uuid = (String) keys.get("uuid");

            sql = "insert into c_exams_questions(exam_id, question_id, sort_index, allocate_score) values ";
            final String PLACE_HOLDER = "(?, ?, ?, ?)";
            List<String> placeHolders = new ArrayList<>();
            List<Object> sqlParams = new ArrayList<>();
            for (int i = 0; i < question_ids.size(); i++) {
                placeHolders.add(PLACE_HOLDER);
                sqlParams.add(exam_id);
                sqlParams.add(question_ids.get(i));
                sqlParams.add(i);
                sqlParams.add(allocate_scores.get(i));
            }
            sql = sql + String.join(", ", placeHolders);

            jdbc.update(sql, sqlParams.toArray());

            jdbc.execute("commit;");
            return new PostExamResponse(exam_id, uuid);
        } catch (Exception e) {
            jdbc.execute("rollback;");
            throw e;
        }
    }

    private Map<String, Object> insertAndGetGeneratedColumns(String sql, Object[] sqlParams) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            for (int i = 0; i < sqlParams.length; i++) {
                ps.setObject(i + 1, sqlParams[i]);
            }
            return ps;
        }, keyHolder);

        return keyHolder.getKeys();
    }

    public GetMyExamResponse getMyExam(String exam_id_str) throws SQLException {
        int exam_id;
        try {
            exam_id = Integer.parseInt(exam_id_str);
        } catch (Exception e) {
            return new GetMyExamResponse();
        }
        String sql = "select * from v_exams where exam_id = ? and user_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, exam_id, session.getLoginUser().getUser_id());

        if (list.size() == 0) {
            return new GetMyExamResponse();
        }

        return new GetMyExamResponse(new ExamBean(list.get(0)));
    }

    public SuccessFlagResponse editExam(Map<String, Object> postParams, String exam_id_str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * フロントに従えばここでエラーは起きないので、詳細なエラー情報は返さない
         */
        int exam_id;
        try {
            exam_id = Integer.parseInt(exam_id_str);
        } catch (Exception e) {
            return SuccessFlagResponse.error();
        }

        String exam_title = postParams.get("exam_title").toString();
        String description = postParams.get("description").toString();
        String password = postParams.get("password").toString();
        String password_check = postParams.get("password_check").toString();
        boolean release_flag = (boolean) postParams.get("release_flag");
        @SuppressWarnings("unchecked")
        List<Integer> question_ids = (List<Integer>) postParams.get("question_ids");
        @SuppressWarnings("unchecked")
        List<Integer> allocate_scores = (List<Integer>) postParams.get("allocate_scores");

        if ("".equals(exam_title) == true) {
            return SuccessFlagResponse.error();
        }
        if (exam_title.length() > 100) {
            return SuccessFlagResponse.error();
        }

        if (description.length() > 1000) {
            return SuccessFlagResponse.error();
        }

        if (password.equals(password_check) == false) {
            return SuccessFlagResponse.error();
        }
        String password_hash = "".equals(password) ? null : PasswordManage.hash(password);

        String sql = "select * from t_questions where user_id != :user_id and question_id in (:question_ids);";
        MapSqlParameterSource sqlParamsMap = new MapSqlParameterSource();
        sqlParamsMap.addValue("question_ids", question_ids);
        sqlParamsMap.addValue("user_id", session.getLoginUser().getUser_id());

        List<Map<String, Object>> list = npjdbc.queryForList(sql, sqlParamsMap);
        if (list.size() != 0) {
            return SuccessFlagResponse.error();
        }

        sql = "select exam_id from t_exams where user_id = ? and exam_id = ?;";
        list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), exam_id);
        if (list.size() == 0) {
            return SuccessFlagResponse.error();
        }

        /**
         * 途中での失敗を拾うためにトランザクションを開始
         * executeでトランザクションを扱うのは非推奨らしいけど面倒なのでこのままで
         */
        jdbc.execute("begin transaction;");

        try {
            if (password_hash == null) {
                sql = "update t_exams set exam_title = ?, description = ?, release_flag = ? where exam_id = ?";
                jdbc.update(sql, exam_title, description, release_flag, exam_id);
            } else {
                sql = "update t_exams set exam_title = ?, description = ?, release_flag = ?, password_hash = ? where exam_id = ?";
                jdbc.update(sql, exam_title, description, release_flag, password_hash, exam_id);
            }

            sql = "delete from c_exams_questions where exam_id = ?";
            jdbc.update(sql, exam_id);

            sql = "insert into c_exams_questions(exam_id, question_id, sort_index, allocate_score) values ";
            final String PLACE_HOLDER = "(?, ?, ?, ?)";
            List<String> placeHolders = new ArrayList<>();
            List<Object> sqlParams = new ArrayList<>();
            for (int i = 0; i < question_ids.size(); i++) {
                placeHolders.add(PLACE_HOLDER);
                sqlParams.add(exam_id);
                sqlParams.add(question_ids.get(i));
                sqlParams.add(i);
                sqlParams.add(allocate_scores.get(i));
            }
            sql = sql + String.join(", ", placeHolders);

            jdbc.update(sql, sqlParams.toArray());

            jdbc.execute("commit;");
            return SuccessFlagResponse.success();
        } catch (Exception e) {
            jdbc.execute("rollback;");
            return SuccessFlagResponse.error();
        }
    }
}

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

import com.krc.pgr.bean.ExamDetailBean;
import com.krc.pgr.response.DownloadExamAnswersResponse;
import com.krc.pgr.response.GetMyExamResponse;
import com.krc.pgr.response.MyExamsResponse;
import com.krc.pgr.response.PostExamResponse;
import com.krc.pgr.response.ScoringExamResponse;
import com.krc.pgr.response.SuccessFlagResponse;
import com.krc.pgr.util.Converter;
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

        return new GetMyExamResponse(new ExamDetailBean(list.get(0)));
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

    public MyExamsResponse getMyExams() {
        String sql = "select exam_id, uuid, exam_title, insert_timestamp, release_flag, array_length(question_ids, 1) as question_count from v_exams where user_id = ?";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id());

        return new MyExamsResponse(list);
    }

    public ScoringExamResponse scoringExam(String exam_id_str) throws SQLException {
        int exam_id;
        try {
            exam_id = Integer.parseInt(exam_id_str);
        } catch (Exception e) {
            return new ScoringExamResponse();
        }

//        String sql = "select * from t_exams where exam_id = ? and user_id = ?;";
//        List<Map<String, Object>> list = jdbc.queryForList(sql, exam_id, session.getLoginUser().getUser_id());
//
//        if (list.size() == 0) {
//            return new ScoringExamResponse();
//        }
        String sql = "select e.exam_id, e.uuid, e.exam_title, array_agg(eq.allocate_score order by eq.sort_index) as allocate_scores from t_exams as e inner join c_exams_questions as eq on e.exam_id = eq.exam_id where e.exam_id = ? and e.user_id = ? group by e.exam_id;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, exam_id, session.getLoginUser().getUser_id());

        if (list.size() == 0) {
            return new ScoringExamResponse();
        }

        String uuid = (String) list.get(0).get("uuid");
        String exam_title = (String) list.get(0).get("exam_title");
        Integer[] allocate_scores = Converter.castPgArray_int(list.get(0).get("allocate_scores"));

        sql = "select * from v_exam_scoring where exam_id = ? order by faculty_id, department_id, class_id, student_number;";
        list = jdbc.queryForList(sql, exam_id);

        return new ScoringExamResponse(exam_title, uuid, allocate_scores, list);
    }

    public DownloadExamAnswersResponse downloadExamAnswers(String exam_id_str, Map<String, Object> postParams) {
        int exam_id;
        try {
            exam_id = Integer.parseInt(exam_id_str);
        } catch (Exception e) {
            return new DownloadExamAnswersResponse();
        }

        @SuppressWarnings("unchecked")
        List<Integer> user_ids = (List<Integer>) postParams.get("user_ids");

        String sql = "select * from t_exams where user_id = ? and exam_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), exam_id);
        if (list.size() == 0) {
            return new DownloadExamAnswersResponse();
        }

        sql = "select a.user_id, a.user_name, a.student_number, a.faculty_id, a.faculty_name, a.department_id, a.department_name, a.class_id, a.class_name, a.question_id, a.select_language, eq.sort_index, a.exec_count from v_answers as a inner join c_exams_questions as eq on a.question_id = eq.question_id where eq.exam_id = :exam_id and a.user_id in (:user_ids);";
        MapSqlParameterSource sqlParams = new MapSqlParameterSource();
        sqlParams.addValue("exam_id", exam_id);
        sqlParams.addValue("user_ids", user_ids);

        list = npjdbc.queryForList(sql, sqlParams);

        return new DownloadExamAnswersResponse(list);
    }
}

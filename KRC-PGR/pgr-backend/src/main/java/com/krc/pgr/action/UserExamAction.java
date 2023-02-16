package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.Question;
import com.krc.pgr.constant.ExecConfirmStatus;
import com.krc.pgr.response.ExecConfirmResponse;
import com.krc.pgr.response.QuestionResponse;
import com.krc.pgr.response.ResponseBase;
import com.krc.pgr.response.ViewExamResponse;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class UserExamAction {
    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private NamedParameterJdbcTemplate npjdbc;

    @Autowired
    private SessionManage session;

    public ViewExamResponse viewExam(String exam_id, Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        String password = (String) postParams.get("password");
        String password_hash = PasswordManage.hash(password);

        // クエリ発行はやろうと思えば1回にできるが、複雑になるので分ける
        String sql = "select exam_title, description, insert_timestamp, e.user_id, case when view_name is null then user_name else view_name end as user_view_name from v_exams as e inner join m_users as u on e.user_id = u.user_id where concat(exam_id, '-', uuid) = ? and e.password_hash = ? and release_flag = true;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, exam_id, password_hash);

        if (list.size() == 0) {
            return ViewExamResponse.notFound();
        }

        Map<String, Object> examData = list.get(0);

        sql = "select eq.question_id, allocate_score, question_title, language_designation, answered from t_exams as e inner join c_exams_questions as eq on e.exam_id = eq.exam_id inner join f_question_thumbnails(?) as t on eq.question_id = t.question_id where e.exam_id = ? order by sort_index;";
        list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), Integer.parseInt(exam_id.substring(0, exam_id.indexOf("-"))));

        /**
         * TODO 採点結果出したい
         */

        session.setViewingExam_id(exam_id);
        return new ViewExamResponse(examData, list);
    }

    public ViewExamResponse viewExam(String exam_id) {
        if (session.isViewingExam(exam_id) == false) {
            return ViewExamResponse.notFound();
        }
        String sql = "select exam_title, description, insert_timestamp, e.user_id, case when view_name is null then user_name else view_name end as user_view_name from v_exams as e inner join m_users as u on e.user_id = u.user_id where concat(exam_id, '-', uuid) = ? and release_flag = true;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, exam_id);

        if (list.size() == 0) {
            return ViewExamResponse.notFound();
        }

        Map<String, Object> examData = list.get(0);

        sql = "select eq.question_id, allocate_score, question_title, language_designation, answered from t_exams as e inner join c_exams_questions as eq on e.exam_id = eq.exam_id inner join f_question_thumbnails(?) as t on eq.question_id = t.question_id where e.exam_id = ? order by sort_index;";
        list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), Integer.parseInt(exam_id.substring(0, exam_id.indexOf("-"))));

        session.setViewingExam_id(exam_id);
        return new ViewExamResponse(examData, list);
    }

    public QuestionResponse viewExamQuestion(String exam_id, String question_id_str) throws SQLException {
        /**
         * 試験セッションがあり、試験が公開中であれば、試験に所属している問題に限り、
         * パスワード無し・公開チェック無しで問題を表示させる。
         */
        if (session.isViewingExam(exam_id) == false) {
            return new QuestionResponse();
        }

        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new QuestionResponse();
        }

        String sql = "select * from t_exams as e inner join c_exams_questions as eq on e.exam_id = eq.exam_id inner join f_questions(?) as q on eq.question_id = q.question_id where e.release_flag = true and eq.question_id = ? and concat(e.exam_id, '-', uuid) = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id, exam_id);

        if (list.size() == 0) {
            return new QuestionResponse();
        }

        return new QuestionResponse(new Question(list.get(0)));
    }
}

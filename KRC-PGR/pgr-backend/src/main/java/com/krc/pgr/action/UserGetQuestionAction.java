package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.Question;
import com.krc.pgr.bean.QuestionThumbnail;
import com.krc.pgr.constant.SearchQuestionsStatus;
import com.krc.pgr.constant.TF;
import com.krc.pgr.params.SearchQuestionsParams;
import com.krc.pgr.response.QuestionResponse;
import com.krc.pgr.response.QuestionWithPasswordResponse;
import com.krc.pgr.response.QuestionsResponse;
import com.krc.pgr.util.LimitQuery;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class UserGetQuestionAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    NamedParameterJdbcTemplate npjdbc;

    public QuestionsResponse questions(Map<String, Object> getParams) {
        SearchQuestionsParams params;
        try {
            params = new SearchQuestionsParams(getParams);
        } catch (Exception e) {
            // 入力値処理中エラー
            return new QuestionsResponse(SearchQuestionsStatus.INPUT_VALUE_ERROR);
        }
        String sqlSelect = "select *, count(*) over()::int as hit_count from f_question_thumbnails(:user_id)";
        String sqlWhere = " where release_flag = true";

        MapSqlParameterSource sqlParams = new MapSqlParameterSource();
        sqlParams.addValue("user_id", session.getLoginUser().getUser_id());

        if (params.getTitle() != null) {
            sqlWhere += " and question_title like :title";
            sqlParams.addValue("title", "%" + params.getTitle() + "%");
        }

        if (params.getPoster_id() != null) {
            try {
                sqlParams.addValue("poster_id", Integer.parseInt(params.getPoster_id()));
            } catch (Exception e) {
                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
            }
            sqlWhere += " and user_id = :poster_id";
        }

        if (params.getLanguage() != null) {
            if (params.getLanguage().size() == 0) {
                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
            }

            sqlWhere += " and coalesce(language_designation, -1) in (:language)";
            Set<Integer> langs = new HashSet<>();
            for (Integer i : params.getLanguage()) {
                langs.add(i);
            }
            sqlParams.addValue("language", langs);
        }

        if (params.getScoring() != TF.TF) {
            if (params.getScoring() == TF.NULL) {
                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
            }
            sqlWhere += " and scoring = :scoring";
            sqlParams.addValue("scoring", params.getScoring() == TF.T);
        }

        if (params.getAnswered() != TF.TF) {
            if (params.getAnswered() == TF.NULL) {
                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
            }
            sqlWhere += " and answered = :answered";
            sqlParams.addValue("answered", params.getAnswered() == TF.T);
        }

        if (params.getPassword() != TF.TF) {
            if (params.getPassword() == TF.NULL) {
                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
            }
            sqlWhere += " and password_required = :password";
            sqlParams.addValue("password", params.getPassword() == TF.T);
        }

        String sqlOrder = " order by question_id " + (params.getSort() == null ? "desc" : "asc");
        String sql = sqlSelect + sqlWhere + sqlOrder + LimitQuery.limitString(params.getPage());
        List<Map<String, Object>> list = npjdbc.queryForList(sql, sqlParams);

        if (list.size() == 0 && params.getPage() != 1) {
            return new QuestionsResponse(SearchQuestionsStatus.OVER_PAGE);
        }
        return new QuestionsResponse(list);
    }

    public QuestionResponse question(String question_id_str) throws SQLException {
        int question_id;
        try {
            /**
             * question_idは整数値しか存在しないため、整数変換でエラーが起きたらnot foundで返す。
             */
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            // question not found
            return new QuestionResponse();
        }

        String sql = "select * from f_questions(?) where release_flag = true and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id);

        if (list.size() == 0) {
            // question not found
            return new QuestionResponse();
        }

        boolean password_required = (boolean) list.get(0).get("password_required");
        if (session.isViewingQuestion(question_id) || password_required == false) {
            session.setViewingQuestion_id(question_id);
            return new QuestionResponse(new Question(list.get(0)));
        } else {
            return new QuestionResponse(new QuestionThumbnail(list.get(0)));
        }
    }

    public QuestionWithPasswordResponse questionWithPassword(String question_id_str, Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException, SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new QuestionWithPasswordResponse();
        }

        String view_password = (String) postParams.get("view_password");
        String view_password_hash = PasswordManage.hash(view_password);

        String sql = "select * from f_questions(?) where release_flag = true and question_id = ? and view_password_hash = ?;";

        List<Map<String, Object>> list = jdbc.queryForList(sql, session.getLoginUser().getUser_id(), question_id, view_password_hash);
        if (list.size() == 0) {
            return new QuestionWithPasswordResponse();
        }

        session.setViewingQuestion_id(question_id);
        return new QuestionWithPasswordResponse(new Question(list.get(0)));
    }
}

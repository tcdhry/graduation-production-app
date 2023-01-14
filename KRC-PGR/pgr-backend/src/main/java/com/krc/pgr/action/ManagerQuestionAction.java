package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.postgresql.jdbc.PgArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import com.krc.pgr.bean.PostQuestionError;
import com.krc.pgr.bean.Question;
import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.SearchQuestionsStatus;
import com.krc.pgr.constant.TF;
import com.krc.pgr.params.PostQuestionParams;
import com.krc.pgr.params.SearchQuestionsParams;
import com.krc.pgr.response.PostQuestionResponse;
import com.krc.pgr.response.QuestionIOResponse;
import com.krc.pgr.response.QuestionResponse;
import com.krc.pgr.response.QuestionsResponse;
import com.krc.pgr.response.TitleCheckResponse;
import com.krc.pgr.util.Converter;
import com.krc.pgr.util.LimitQuery;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class ManagerQuestionAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    NamedParameterJdbcTemplate npjdbc;

    public TitleCheckResponse titleCheck(Map<String, Object> postParams) {
        /**
         * 存在しないタイトルかどうか(登録できるタイトルか)をチェックする。
         * 存在しなければnotExistTitleにtrueを格納して返却する。
         */
        String question_title = (String) postParams.get("question_title");

        return new TitleCheckResponse(isNotExistTitle(question_title));
    }

    private boolean isNotExistTitle(String question_title) {
        /**
         * 登録済みのタイトルでなければtrueを返却する。
         */
        String sql = "select * from t_questions where question_title = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_title);
        return list.size() == 0;
    }

    public PostQuestionResponse postQuestion(Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * errorList もしくは generatedId のどちらかを返す。
         */
        PostQuestionParams params = new PostQuestionParams(postParams);
        String question_title = params.getQuestion_title();

        ArrayList<PostQuestionError> errorList = new ArrayList<>();

        if (question_title.length() == 0) {
            // title not enter err
            errorList.add(new PostQuestionError("question_title", "タイトルを記述してください。"));
        } else if (question_title.replaceAll("\s", "").length() == 0) {
            // title whitespace only err
            errorList.add(new PostQuestionError("question_title", "タイトルを空白文字のみで構成することはできません。"));
        } else if (question_title.length() > 50) {
            // title longer err
            errorList.add(new PostQuestionError("question_title", "タイトルが長すぎます。"));
        } else if (!isNotExistTitle(question_title)) {
            // title exist err
            errorList.add(new PostQuestionError("question_title", "タイトルが既に使用されています。"));
        }

        String question_text = params.getQuestion_text();
        if (question_text.length() == 0) {
            // text not enter err
            errorList.add(new PostQuestionError("question_text", "問題文が記述されていません。"));
        } else if (question_text.length() > 2000) {
            // text longer err
            errorList.add(new PostQuestionError("question_text", "問題文が長すぎます。"));
        }

        String input = params.getInput();
        if (input.length() > 1000) {
            // input longer err
            errorList.add(new PostQuestionError("input", "入力形式が長すぎます。"));
        }

        String input_explain = params.getInput_explain();
        if (input_explain.length() > 1000) {
            // input_explain longer err
            errorList.add(new PostQuestionError("input_explain", "入力形式の説明が長すぎます。"));
        }

        String output = params.getOutput();
        if (output.length() > 1000) {
            // output longer err
            errorList.add(new PostQuestionError("output", "出力形式が長すぎます。"));
        }

        String output_explain = params.getOutput_explain();
        if (output_explain.length() > 1000) {
            // output longer err
            errorList.add(new PostQuestionError("output_explain", "出力形式の説明が長すぎます。"));
        }

        String[] inputs = params.getInputs();
        String[] outputs = params.getOutputs();
        String[] io_explain = params.getIo_explain();
        boolean nullFlag = false;
        for (int i = 0; i < 3; i++) {
            if ("".equals(inputs[i])) {
                inputs[i] = null;
            }
            if ("".equals(outputs[i])) {
                outputs[i] = null;
            }
            if ("".equals(io_explain[i])) {
                io_explain[i] = null;
            }

//            入力が無い問題で意図しない挙動になる恐れがあるのでコメントアウト。
//            最後に改行を入れる必要がある注意書きはするが、入れ忘れは拾わない。
//            /**
//             * 末尾が改行だった場合、排除する。
//             * 改行でない場合に付け足す方向性だと、その付け足しで文字数あふれする場合が考えられ、その分の処理が面倒なため。
//             * 実行時に統一して末尾の改行を付与する。
//             */
//            if (inputs[i].charAt(inputs[i].length() - 1) == '\n') {
//                inputs[i] = inputs[i].substring(0, inputs[i].length() - 1);
//            }
//
//            if (outputs[i].charAt(outputs[i].length() - 1) == '\n') {
//                outputs[i] = outputs[i].substring(0, outputs[i].length() - 1);
//            }

            if (nullFlag == true) {
                inputs[i] = null;
                outputs[i] = null;
                io_explain[i] = null;
            } else {
                if (inputs[i] != null && inputs[i].length() > 1000) {
                    // inputs[i] longer err
                    errorList.add(new PostQuestionError("inputs_" + (i + 1), "入力例" + (i + 1) + "が長すぎます。"));
                }
                if (outputs[i] != null && outputs[i].length() > 1000) {
                    // outputs[i] longer err
                    errorList.add(new PostQuestionError("outputs_" + (i + 1), "出力例" + (i + 1) + "が長すぎます。"));
                }
                if (io_explain[i] != null && io_explain[i].length() > 1000) {
                    // io_explain[i] longer err
                    errorList.add(new PostQuestionError("io_explain_" + (i + 1), "入出力例" + (i + 1) + "の補足が長すぎます。"));
                }
                if (inputs[i] == null && outputs[i] == null && io_explain[i] == null) {
                    nullFlag = true;
                }
            }
        }

        Integer language_designation = params.getLanguage_designation();
        if (language_designation != null) {
            try {
                Language.valueOf(language_designation);
            } catch (IllegalArgumentException e) {
                // language not found err
                errorList.add(new PostQuestionError("language_designation", "未実装の言語が選択されました。"));
            }
        }

        String view_password = params.getView_password();
        String view_password_check = params.getView_password_check();
        if (!view_password.equals(view_password_check)) {
            // password not match err
            errorList.add(new PostQuestionError("view_password", "問題表示パスワードが（確認）と一致しません。"));
        }

        if (errorList.size() != 0) {
            // return error
            return new PostQuestionResponse(errorList);
        }

        String view_password_hash = "".equals(view_password) ? null : PasswordManage.hash(view_password);
        boolean private_answer_mode = params.getPrivate_answer_mode();
        boolean release_flag = params.getRelease_flag();

        String sql = "insert into t_questions(question_title, question_text, input, input_explain, output, output_explain, inputs, outputs, io_explain, language_designation, view_password_hash, private_answer_mode, release_flag, user_id, insert_timestamp) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp);";
        Object[] sqlParams = { question_title, question_text, input, input_explain, output, output_explain, inputs, outputs, io_explain, language_designation, view_password_hash, private_answer_mode, release_flag, session.getLoginUser().getUser_id() };

        int generatedId = insertAndGetGeneratedId(sql, sqlParams, "question_id");

        return new PostQuestionResponse(generatedId);
    }

    private int insertAndGetGeneratedId(String sql, Object[] sqlParams, String primaryKeyName) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            for (int i = 0; i < sqlParams.length; i++) {
                ps.setObject(i + 1, sqlParams[i]);
            }
            return ps;
        }, keyHolder);

        int generatedId = (int) keyHolder.getKeys().get(primaryKeyName);
        return generatedId;
    }

    public QuestionsResponse myQuestions(Map<String, Object> getParams) {
        SearchQuestionsParams params;
        try {
            params = new SearchQuestionsParams(getParams);
        } catch (Exception e) {
            // 入力値処理中エラー
            return new QuestionsResponse(SearchQuestionsStatus.INPUT_VALUE_ERROR);
        }
        String sqlSelect = "select *, count(*) over()::int as hit_count from f_question_thumbnails(:user_id)";
        String sqlWhere = " where user_id = :user_id";

        MapSqlParameterSource sqlParams = new MapSqlParameterSource();
        sqlParams.addValue("user_id", session.getLoginUser().getUser_id());

        if (params.getTitle() != null) {
            sqlWhere += " and question_title like :title";
            sqlParams.addValue("title", "%" + params.getTitle() + "%");
        }

        // 自分の問題一覧のため投稿者の指定は無視
//        if (params.getPoster_id() != null) {
//            try {
//                sqlParams.addValue("poster_id", Integer.parseInt(params.getPoster_id()));
//            } catch (Exception e) {
//                return new QuestionsResponse(SearchQuestionsStatus.NOT_HIT);
//            }
//            sqlWhere += " and user_id = :poster_id";
//        }

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

    public QuestionResponse editQuestion(String question_id_str) throws SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new QuestionResponse();
        }

        String sql = "select * from f_questions(?) where question_id = ? and user_id = ?";
        int user_id = session.getLoginUser().getUser_id();
        List<Map<String, Object>> list = jdbc.queryForList(sql, user_id, question_id, user_id);

        if (list.size() == 0) {
            // not found || not poster session
            return new QuestionResponse();
        }

        Map<String, Object> question = list.get(0);
        return new QuestionResponse(new Question(question));
    }

    public QuestionIOResponse getQuestionIO(String question_id_str) throws SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new QuestionIOResponse();
        }

        String sql = "select input_judge, output_judge from f_questions(?) where user_id = ? and question_id = ?;";
        int user_id = session.getLoginUser().getUser_id();
        List<Map<String, Object>> list = jdbc.queryForList(sql, user_id, user_id, question_id);

        if (list.size() == 0) {
            return new QuestionIOResponse();
        }

        Map<String, Object> question = list.get(0);
        String[] input_judge = question.get("input_judge") == null ? null : Converter.castPgArray(question.get("input_judge"));
        String[] output_judge = question.get("output_judge") == null ? null : Converter.castPgArray(question.get("output_judge"));

        return new QuestionIOResponse(input_judge, output_judge);
    }
}
package com.krc.pgr.action;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import com.krc.pgr.bean.PostQuestionError;
import com.krc.pgr.constant.Language;
import com.krc.pgr.params.PostQuestionParams;
import com.krc.pgr.response.PostQuestionResponse;
import com.krc.pgr.response.TitleCheckResponse;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class ManagerQuestionAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

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

    public PostQuestionResponse postQuestion(Map<String, Object> postParams) throws Exception {
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
}
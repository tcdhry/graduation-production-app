package com.krc.pgr.action;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.ExecStatus;
import com.krc.pgr.constant.AnswerConfirmStatus;
import com.krc.pgr.constant.ExecConfirmStatus;
import com.krc.pgr.constant.ExecStatusCode;
import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.LanguageRuntimeMap;
import com.krc.pgr.response.AnswerConfirmResponse;
import com.krc.pgr.response.ExecConfirmResponse;
import com.krc.pgr.runtime.RuntimeManage;
import com.krc.pgr.util.Converter;
import com.krc.pgr.util.SessionManage;

@Component
public class UserExecQuestionAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    NamedParameterJdbcTemplate npjdbc;

    @Autowired
    LanguageRuntimeMap languageRuntimeMap;

    public ExecConfirmResponse execConfirm(String question_id_str, Map<String, Object> postParams) throws SQLException, IOException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            // question not found
            return new ExecConfirmResponse(ExecConfirmStatus.NOT_FOUND);
        }

        if (!session.isViewingQuestion(question_id)) {
            // not viewing session
            return new ExecConfirmResponse(ExecConfirmStatus.NOT_VIEWING_SESSION);
        }

        String source_code = (String) postParams.get("source_code");
        if ("".equals(source_code)) {
            // source code not input
            return new ExecConfirmResponse(ExecConfirmStatus.SOURCE_CODE_NOT_INPUT);
        }

        Language select_language;
        try {
            select_language = Language.valueOf((int) postParams.get("select_language"));
        } catch (Exception e) {
            // language not found
            return new ExecConfirmResponse(ExecConfirmStatus.LANGUAGE_ERROR);
        }

        String sql = "select inputs, outputs, io_explain, language_designation from t_questions where release_flag = true and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id);

        if (list.size() == 0) {
            // question not found
            return new ExecConfirmResponse(ExecConfirmStatus.NOT_FOUND);
        }

        Map<String, Object> question = list.get(0);

        Integer language_designation = (Integer) question.get("language_designation");
        if (language_designation != null && language_designation != select_language.getId()) {
            // 言語指定があり、選択言語が違う場合
            return new ExecConfirmResponse(ExecConfirmStatus.LANGUAGE_ERROR);
        }

        String[] inputs = Converter.castPgArray_str(question.get("inputs"));
        String[] outputs = Converter.castPgArray_str(question.get("outputs"));
        String[] io_explain = Converter.castPgArray_str(question.get("io_explain"));

        RuntimeManage runtime = languageRuntimeMap.getExecConfirmRuntimeInstance(select_language, question_id, source_code);
        List<ExecStatus> execList = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            if (inputs[i] == null && outputs[i] == null && io_explain[i] == null) {
                break;
            }
            ExecStatus execStatus = runtime.compileAndExec(inputs[i], outputs[i]);
            execList.add(execStatus);
            if (execStatus.getExecStatusCode() == ExecStatusCode.COMPILATION_ERROR.getId()) {
                break;
            }
        }

        return new ExecConfirmResponse(execList);
    }

    public AnswerConfirmResponse answerConfirm(String question_id_str, Map<String, Object> postParams) throws IOException, SQLException {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            // question not found
            return new AnswerConfirmResponse(AnswerConfirmStatus.NOT_FOUND);
        }

        if (!session.isViewingQuestion(question_id)) {
            // not viewing session
            return new AnswerConfirmResponse(AnswerConfirmStatus.NOT_VIEWING_SESSION);
        }

        String source_code = (String) postParams.get("source_code");

        Language select_language;
        try {
            select_language = Language.valueOf((int) postParams.get("select_language"));
        } catch (Exception e) {
            // language not found
            return new AnswerConfirmResponse(AnswerConfirmStatus.LANGUAGE_ERROR);
        }

        String sql = "select (input_judge is not null and output_judge is not null) as scoring, input_judge, output_judge, language_designation from t_questions where release_flag = true and question_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, question_id);

        if (list.size() == 0) {
            // question not found
            return new AnswerConfirmResponse(AnswerConfirmStatus.NOT_FOUND);
        }

        Map<String, Object> question = list.get(0);

        Integer language_designation = (Integer) question.get("language_designation");
        if (language_designation != null && language_designation != select_language.getId()) {
            // 言語指定があり、選択言語が違う場合
            return new AnswerConfirmResponse(AnswerConfirmStatus.LANGUAGE_ERROR);
        }

        int rows_count = source_code.split("\n").length;
        int chars_count = source_code.length();

        // このタイミングでファイルが保存される。
        RuntimeManage runtime = languageRuntimeMap.getAnswerConfirmRuntimeInstance(select_language, question_id, source_code);

        /**
         * insert into t_answers(id_col, col_1, col_2) values(new_id, val_1, val_2)
         * on conflict(id_col)
         * do update set col_1 = excluded.col_1, col_2 = excluded.col_2;
         * 
         * insert時にid_col列が重複していれば、updateに切り替える。
         * excluded.col_1はinsertのvaluesで入力された値を自動で入力される。
         * conflictに指定した列を自動で絞り込むためwhere句は必要ない。
         */
//        sql = "insert into t_answers(question_id, user_id, select_language, rows_count, chars_count, insert_timestamp) values(?, ?, ?, ?, ?, current_timestamp) on conflict(question_id, user_id) do update set select_language = excluded.select_language, rows_count = excluded.rows_count, chars_count = excluded.chars_count, insert_timestamp = excluded.insert_timestamp;";

        int user_id = session.getLoginUser().getUser_id();

        /**
         * ↓紐づけられたt_executionsのデータも外部キー制約によって自動で削除させる。
         */
        sql = "delete from t_answers where question_id = ? and user_id = ?";
        jdbc.update(sql, question_id, user_id);

        sql = "insert into t_answers(question_id, user_id, select_language, rows_count, chars_count, insert_timestamp) values(?, ?, ?, ?, ?, current_timestamp);";
        jdbc.update(sql, question_id, user_id, select_language.getId(), rows_count, chars_count);

        if ((boolean) question.get("scoring") == false) {
            return new AnswerConfirmResponse(AnswerConfirmStatus.SUCCESS);
        }

        String[] input_judge = Converter.castPgArray_str(question.get("input_judge"));
        String[] output_judge = Converter.castPgArray_str(question.get("output_judge"));

//        List<ExecStatus> execList = new ArrayList<>();

        sql = "insert into t_executions(exec_number, question_id, user_id, exec_time, exec_status_id) values";
        final String sqlValuesPlaceHolder = "(?, ?, ?, ?, ?)";
        ArrayList<String> sqlValues = new ArrayList<>();
        ArrayList<Object> sqlParams = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            if (input_judge[i] == null && output_judge[i] == null) {
                break;
            }

            ExecStatus execStatus = runtime.compileAndExec(input_judge[i], output_judge[i]);
            runtime.writeOutputToFile(i, execStatus.getOutput());
//            execList.add(execStatus);

            sqlValues.add(sqlValuesPlaceHolder);
            sqlParams.add(i);
            sqlParams.add(question_id);
            sqlParams.add(user_id);
            sqlParams.add(execStatus.getExecTime());
            sqlParams.add(execStatus.getExecStatusCode());

            if (execStatus.getExecStatusCode() == ExecStatusCode.COMPILATION_ERROR.getId()) {
                break;
            }
        }

        sql = sql + String.join(",", sqlValues) + ";";
        jdbc.update(sql, sqlParams.toArray());

        return new AnswerConfirmResponse();
    }
}

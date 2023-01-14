package com.krc.pgr.action;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.postgresql.jdbc.PgArray;
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
import com.krc.pgr.runtime.CPlusPlusRuntime;
import com.krc.pgr.runtime.CSharpRuntime;
import com.krc.pgr.runtime.JavaRuntime;
import com.krc.pgr.runtime.PythonRuntime;
import com.krc.pgr.runtime.RubyRuntime;
import com.krc.pgr.runtime.RuntimeManage;
import com.krc.pgr.util.Converter;
import com.krc.pgr.util.FileManage;
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

        String[] inputs = Converter.castPgArray(question.get("inputs"));
        String[] outputs = Converter.castPgArray(question.get("outputs"));
        String[] io_explain = Converter.castPgArray(question.get("io_explain"));

        RuntimeManage runtime = languageRuntimeMap.getRuntimeInstance(select_language, question_id, source_code, true);
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

    public AnswerConfirmResponse answerConfirm(String question_id_str, Map<String, Object> postParams) throws IOException {
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

        String sql = "select scoring, input_judge, output_judge, language_designation from t_questions where release_flag = true and question_id = ?;";
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

        if ((boolean) question.get("scoring") == false) {
            // 採点が無い問題であれば、コードを保存し、レスポンスを返す。
            FileManage.createFile("\\pgr-codes\\submits\\q1\\u2009011\\", source_code);
            sql = "";
        }

        return null;
    }

}

package com.krc.pgr.bean;

import java.sql.SQLException;
import java.util.Map;

import org.postgresql.jdbc.PgArray;

import com.krc.pgr.util.Converter;

public class Question {
    /**
     * 問題表示に必要な情報
     * そのままJSONとして返却するため、パスワードハッシュなどの内部情報は絶対に入れないこと。
     */
    private String question_id;
    private String question_title;
    private String question_text;
    private String input;
    private String input_explain;
    private String output;
    private String output_explain;
    private String[] inputs;
    private String[] outputs;
    private String[] io_explain;
    private Integer language_designation;
    private boolean private_answer_mode;
    private boolean release_flag;
    private boolean scoring;
    private String insert_timestamp;
    private String user_id;
    private String user_view_name;

    public Question(Map<String, Object> map) throws SQLException {
        this.question_id = Integer.toString((int) map.get("question_id"));
        this.question_title = (String) map.get("question_title");
        this.question_text = (String) map.get("question_text");
        this.input = (String) map.get("input");
        this.input_explain = (String) map.get("input_explain");
        this.output = (String) map.get("output");
        this.output_explain = (String) map.get("output_explain");
        this.inputs = Converter.castPgArray(map.get("inputs"));
        this.outputs = Converter.castPgArray(map.get("outputs"));
        this.io_explain = Converter.castPgArray(map.get("io_explain"));
        this.language_designation = (Integer) map.get("language_designation");
        this.private_answer_mode = (boolean) map.get("private_answer_mode");
        this.release_flag = (boolean) map.get("release_flag");
        this.scoring = (boolean) map.get("scoring");
        this.insert_timestamp = (String) map.get("insert_timestamp");
        this.user_id = Integer.toString((int) map.get("user_id"));
        this.user_view_name = (String) map.get("user_view_name");
    }

    public String getQuestion_id() {
        return question_id;
    }

    public String getQuestion_title() {
        return question_title;
    }

    public String getQuestion_text() {
        return question_text;
    }

    public String getInput() {
        return input;
    }

    public String getInput_explain() {
        return input_explain;
    }

    public String getOutput() {
        return output;
    }

    public String getOutput_explain() {
        return output_explain;
    }

    public String[] getInputs() {
        return inputs;
    }

    public String[] getOutputs() {
        return outputs;
    }

    public String[] getIo_explain() {
        return io_explain;
    }

    public Integer getLanguage_designation() {
        return language_designation;
    }

    public boolean getPrivate_answer_mode() {
        return private_answer_mode;
    }

    public boolean getRelease_flag() {
        return release_flag;
    }

    public boolean getScoring() {
        return scoring;
    }

    public String getInsert_timestamp() {
        return insert_timestamp;
    }

    public String getUser_id() {
        return user_id;
    }

    public String getUser_view_name() {
        return user_view_name;
    }
}

package com.krc.pgr.params;

import java.util.ArrayList;
import java.util.Map;

public class PostQuestionParams {
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
    private String view_password;
    private String view_password_check;
    private boolean private_answer_mode;
    private boolean release_flag;

    public PostQuestionParams(Map<String, Object> postParams) {
        this.question_title = postParams.get("question_title").toString();
        this.question_text = postParams.get("question_text").toString();
        this.input = postParams.get("input").toString();
        this.input_explain = postParams.get("input_explain").toString();
        this.output = postParams.get("output").toString();
        this.output_explain = postParams.get("output_explain").toString();
        this.inputs = toArray(postParams.get("inputs"));
        this.outputs = toArray(postParams.get("outputs"));
        this.io_explain = toArray(postParams.get("io_explain"));
        this.language_designation = (Integer) postParams.get("language_designation");
        this.view_password = postParams.get("view_password").toString();
        this.view_password_check = postParams.get("view_password_check").toString();
        this.private_answer_mode = (boolean) postParams.get("private_answer_mode");
        this.release_flag = (boolean) postParams.get("release_flag");
    }

    private String[] toArray(Object o) {
        @SuppressWarnings("unchecked")
        ArrayList<Object> objArr = (ArrayList<Object>) o;
        return new String[] { (String) objArr.get(0), (String) objArr.get(1), (String) objArr.get(2) };
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

    public String getView_password() {
        return view_password;
    }

    public String getView_password_check() {
        return view_password_check;
    }

    public boolean getPrivate_answer_mode() {
        return private_answer_mode;
    }

    public boolean getRelease_flag() {
        return release_flag;
    }
}

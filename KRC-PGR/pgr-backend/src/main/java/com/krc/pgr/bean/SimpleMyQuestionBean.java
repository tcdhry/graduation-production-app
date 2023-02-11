package com.krc.pgr.bean;

import java.util.Map;

public class SimpleMyQuestionBean {
    private int question_id;
    private String question_title;
    private Integer language_designation;
    private boolean password_required;
    private boolean private_answer_mode;
    private boolean release_flag;
    private String insert_datetime;
    private boolean scoring;

    public SimpleMyQuestionBean(Map<String, Object> question) {
        this.question_id = (int) question.get("question_id");
        this.question_title = (String) question.get("question_title");
        this.language_designation = (Integer) question.get("language_designation");
        this.password_required = (boolean) question.get("password_required");
        this.private_answer_mode = (boolean) question.get("private_answer_mode");
        this.release_flag = (boolean) question.get("release_flag");
        this.insert_datetime = (String) question.get("insert_datetime");
        this.scoring = (boolean) question.get("scoring");
    }

    public int getQuestion_id() {
        return question_id;
    }

    public String getQuestion_title() {
        return question_title;
    }

    public Integer getLanguage_designation() {
        return language_designation;
    }

    public boolean isPassword_required() {
        return password_required;
    }

    public boolean isPrivate_answer_mode() {
        return private_answer_mode;
    }

    public boolean isRelease_flag() {
        return release_flag;
    }

    public String getInsert_datetime() {
        return insert_datetime;
    }

    public boolean isScoring() {
        return scoring;
    }
}
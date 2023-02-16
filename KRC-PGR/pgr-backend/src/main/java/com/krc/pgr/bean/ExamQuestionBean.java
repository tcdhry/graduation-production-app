package com.krc.pgr.bean;

import java.util.Map;

public class ExamQuestionBean {
    private int question_id;
    private String question_title;
    private Integer language_designation;
    private boolean answered;
    private int allocate_score;

    public ExamQuestionBean(Map<String, Object> question) {
        this.question_id = (int) question.get("question_id");
        this.question_title = (String) question.get("question_title");
        this.language_designation = (Integer) question.get("language_designation");
        this.answered = (boolean) question.get("answered");
        this.allocate_score = (int) question.get("allocate_score");
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

    public boolean isAnswered() {
        return answered;
    }

    public int getAllocate_score() {
        return allocate_score;
    }
}

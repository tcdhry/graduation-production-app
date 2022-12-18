package com.krc.pgr.bean;

import java.util.Map;

public class QuestionThumbnail {
    private int question_id;
    private String question_title;
    private Integer language_designation;
    private boolean private_answer_mode;
    private boolean release_flag;
    private boolean answered;
    private boolean scoring;
    private boolean password_required;
    private String insert_timestamp;
    private String user_id;
    private String user_view_name;

    public QuestionThumbnail(Map<String, Object> map) {
        this.question_id = (int) map.get("question_id");
        this.question_title = (String) map.get("question_title");
        this.language_designation = (Integer) map.get("language_designation");
        this.private_answer_mode = (boolean) map.get("private_answer_mode");
        this.release_flag = (boolean) map.get("release_flag");
        this.answered = (boolean) map.get("answered");
        this.scoring = (boolean) map.get("scoring");
        this.password_required = (boolean) map.get("password_required");
        this.insert_timestamp = (String) map.get("insert_timestamp");
        this.user_id = map.get("user_id").toString();
        this.user_view_name = (String) map.get("user_view_name");
    }

//    public QuestionThumbnail(int question_id, String question_title, Integer language_designation, boolean private_answer_mode, boolean release_flag, boolean answered, boolean scoring, boolean password_required, String insert_timestamp, String user_id, String user_view_name) {
//        this.question_id = question_id;
//        this.question_title = question_title;
//        this.language_designation = language_designation;
//        this.private_answer_mode = private_answer_mode;
//        this.release_flag = release_flag;
//        this.answered = answered;
//        this.scoring = scoring;
//        this.password_required = password_required;
//        this.insert_timestamp = insert_timestamp;
//        this.user_id = user_id;
//        this.user_view_name = user_view_name;
//    }

    public int getQuestion_id() {
        return question_id;
    }

    public String getQuestion_title() {
        return question_title;
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

    public boolean getAnswered() {
        return answered;
    }

    public boolean getScoring() {
        return scoring;
    }

    public boolean getPassword_required() {
        return password_required;
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

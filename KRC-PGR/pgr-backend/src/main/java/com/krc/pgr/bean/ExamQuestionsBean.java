package com.krc.pgr.bean;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ExamQuestionsBean {
    private String exam_title;
    private String description;
    private String insert_timestamp;
    private int user_id;
    private String user_view_name;
    private List<ExamQuestionBean> questions;

    public ExamQuestionsBean(Map<String, Object> examData, List<Map<String, Object>> questions) {
        this.exam_title = (String) examData.get("exam_title");
        this.description = (String) examData.get("description");
        this.insert_timestamp = (String) examData.get("insert_timestamp");
        this.user_id = (int) examData.get("user_id");
        this.user_view_name = (String) examData.get("user_view_name");
        this.questions = questions.stream().map(q -> new ExamQuestionBean(q)).collect(Collectors.toList());
    }

    public String getExam_title() {
        return exam_title;
    }

    public String getDescription() {
        return description;
    }

    public String getInsert_timestamp() {
        return insert_timestamp;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUser_view_name() {
        return user_view_name;
    }

    public List<ExamQuestionBean> getQuestions() {
        return questions;
    }
}

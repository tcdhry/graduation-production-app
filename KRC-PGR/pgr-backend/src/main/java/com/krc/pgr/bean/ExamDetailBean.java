package com.krc.pgr.bean;

import java.sql.SQLException;
import java.util.Map;

import com.krc.pgr.util.Converter;

public class ExamDetailBean {
    private int exam_id;
    private String exam_title;
    private String description;
    private String uuid;
    private String insert_timestamp;
    private Integer[] question_ids;
    private Integer[] allocate_scores;
    private boolean release_flag;

    public ExamDetailBean(Map<String, Object> exam) throws SQLException {
        this.exam_id = (int) exam.get("exam_id");
        this.exam_title = (String) exam.get("exam_title");
        this.description = (String) exam.get("description");
        this.uuid = (String) exam.get("uuid");
        this.insert_timestamp = (String) exam.get("insert_timestamp");
        this.question_ids = Converter.castPgArray_int(exam.get("question_ids"));
        this.allocate_scores = Converter.castPgArray_int(exam.get("allocate_scores"));
        this.release_flag = (boolean) exam.get("release_flag");
    }

    public int getExam_id() {
        return exam_id;
    }

    public String getExam_title() {
        return exam_title;
    }

    public String getDescription() {
        return description;
    }

    public String getUuid() {
        return uuid;
    }

    public String getInsert_timestamp() {
        return insert_timestamp;
    }

    public Integer[] getQuestion_ids() {
        return question_ids;
    }

    public Integer[] getAllocate_scores() {
        return allocate_scores;
    }

    public boolean getRelease_flag() {
        return release_flag;
    }
}

package com.krc.pgr.response;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MyExamsResponse extends ResponseBase {
    private List<Exam> exams;

    public MyExamsResponse(List<Map<String, Object>> exams) {
        this.exams = exams.stream().map(exam -> new Exam(exam)).collect(Collectors.toList());
    }

    public List<Exam> getExams() {
        return exams;
    }
}

class Exam {
    private int exam_id;
    private String uuid;
    private String exam_title;
    private String insert_timestamp;
    private boolean release_flag;
    private int question_count;

    public Exam(Map<String, Object> exam) {
        this.exam_id = (int) exam.get("exam_id");
        this.uuid = (String) exam.get("uuid");
        this.exam_title = (String) exam.get("exam_title");
        this.insert_timestamp = (String) exam.get("insert_timestamp");
        this.release_flag = (boolean) exam.get("release_flag");
        this.question_count = (int) exam.get("question_count");
    }

    public int getExam_id() {
        return exam_id;
    }

    public String getUuid() {
        return uuid;
    }

    public String getExam_title() {
        return exam_title;
    }

    public String getInsert_timestamp() {
        return insert_timestamp;
    }

    public boolean isRelease_flag() {
        return release_flag;
    }

    public int getQuestion_count() {
        return question_count;
    }
}
package com.krc.pgr.response;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.util.Converter;

public class ScoringExamResponse extends ResponseBase {
    private String exam_title;
    private String uuid;
    private Integer[] allocate_scores;
    private List<ScoringExamRow> scores;

    public ScoringExamResponse(String exam_title, String uuid, Integer[] allocate_scores, List<Map<String, Object>> scores) throws SQLException {
        this.exam_title = exam_title;
        this.uuid = uuid;
        this.allocate_scores = allocate_scores;
        this.scores = new ArrayList<>();
        for (Map<String, Object> score : scores) {
            this.scores.add(new ScoringExamRow(score));
        }
    }

    public ScoringExamResponse() {
    }

    public String getExam_title() {
        return exam_title;
    }

    public String getUuid() {
        return uuid;
    }

    public Integer[] getAllocate_scores() {
        return allocate_scores;
    }

    public List<ScoringExamRow> getScores() {
        return scores;
    }
}

class ScoringExamRow {
    private int user_id;
    private String user_name;
    private Integer student_number;
    private Integer class_id;
    private String class_name;
    private Integer department_id;
    private String department_name;
    private Integer faculty_id;
    private String faculty_name;
    private Integer[] question_ids;
    private String[] insert_timestampes;
    private Integer[] exec_counts;
    private Integer[] accepted_counts;

    ScoringExamRow(Map<String, Object> row) throws SQLException {
        this.user_id = (int) row.get("user_id");
        this.user_name = (String) row.get("user_name");
        this.student_number = (Integer) row.get("student_number");
        this.class_id = (Integer) row.get("class_id");
        this.class_name = (String) row.get("class_name");
        this.department_id = (Integer) row.get("department_id");
        this.department_name = (String) row.get("department_name");
        this.faculty_id = (Integer) row.get("faculty_id");
        this.faculty_name = (String) row.get("faculty_name");
        this.question_ids = Converter.castPgArray_int(row.get("question_ids"));
        this.insert_timestampes = Converter.castPgArray_str(row.get("insert_timestampes"));
        this.exec_counts = Converter.castPgArray_int(row.get("exec_counts"));
        this.accepted_counts = Converter.castPgArray_int(row.get("accepted_counts"));
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public Integer getStudent_number() {
        return student_number;
    }

    public Integer getClass_id() {
        return class_id;
    }

    public String getClass_name() {
        return class_name;
    }

    public Integer getDepartment_id() {
        return department_id;
    }

    public String getDepartment_name() {
        return department_name;
    }

    public Integer getFaculty_id() {
        return faculty_id;
    }

    public String getFaculty_name() {
        return faculty_name;
    }

    public Integer[] getQuestion_ids() {
        return question_ids;
    }

    public String[] getInsert_timestampes() {
        return insert_timestampes;
    }

    public Integer[] getExec_counts() {
        return exec_counts;
    }

    public Integer[] getAccepted_counts() {
        return accepted_counts;
    }
}

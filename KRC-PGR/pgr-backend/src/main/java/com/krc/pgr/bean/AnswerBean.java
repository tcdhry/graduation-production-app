package com.krc.pgr.bean;

import java.sql.SQLException;
import java.util.Map;

import com.krc.pgr.util.Converter;

public class AnswerBean {
    private int user_id;
    private String user_name;
    private Integer student_number;
    private Integer class_id;
    private String class_name;
    private Integer department_id;
    private String department_name;
    private Integer faculty_id;
    private String faculty_name;
    private Integer select_language;
    private int rows_count;
    private int chars_count;
    private String insert_timestamp;
    private int exec_count;
    private int accepted_count;
    private Integer[] exec_statuses;

    public AnswerBean(Map<String, Object> map) throws SQLException {
        this.user_id = (int) map.get("user_id");
        this.user_name = (String) map.get("user_name");
        this.student_number = (Integer) map.get("student_number");
        this.class_id = (Integer) map.get("class_id");
        this.class_name = (String) map.get("class_name");
        this.department_id = (Integer) map.get("department_id");
        this.department_name = (String) map.get("department_name");
        this.faculty_id = (Integer) map.get("faculty_id");
        this.faculty_name = (String) map.get("faculty_name");
        this.select_language = (Integer) map.get("select_language");
        this.rows_count = (int) map.get("rows_count");
        this.chars_count = (int) map.get("chars_count");
        this.insert_timestamp = (String) map.get("insert_timestamp");
        this.exec_count = (int) map.get("exec_count");
        this.accepted_count = (int) map.get("accepted_count");
        this.exec_statuses = Converter.castPgArray_int(map.get("exec_statuses"));
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

    public Integer getSelect_language() {
        return select_language;
    }

    public int getRows_count() {
        return rows_count;
    }

    public int getChars_count() {
        return chars_count;
    }

    public String getInsert_timestamp() {
        return insert_timestamp;
    }

    public int getExec_count() {
        return exec_count;
    }

    public int getAccepted_count() {
        return accepted_count;
    }

    public Integer[] getExec_statuses() {
        return exec_statuses;
    }
}

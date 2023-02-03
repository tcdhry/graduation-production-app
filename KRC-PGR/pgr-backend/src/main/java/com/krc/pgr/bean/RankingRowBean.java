package com.krc.pgr.bean;

import java.math.BigDecimal;
import java.util.Map;

public class RankingRowBean {
    private int user_id;
    private Integer student_number;
    private String user_view_name;
    private String class_name;
    private String department_name;
    private String faculty_name;
    private Integer select_language;
    private int chars_count;
    private int rows_count;
    private BigDecimal score;
    private int min_time;

    public RankingRowBean(Map<String, Object> row) {
        this.user_id = (int) row.get("user_id");
        this.student_number = (Integer) row.get("student_number");
        this.user_view_name = (String) row.get("user_view_name");
        this.class_name = (String) row.get("class_name");
        this.department_name = (String) row.get("department_name");
        this.faculty_name = (String) row.get("faculty_name");
        this.select_language = (Integer) row.get("select_language");
        this.chars_count = (int) row.get("chars_count");
        this.rows_count = (int) row.get("rows_count");
        this.score = (BigDecimal) row.get("score");
        this.min_time = (int) row.get("min_time");
    }

    public int getUser_id() {
        return user_id;
    }

    public Integer getStudent_number() {
        return student_number;
    }

    public String getUser_view_name() {
        return user_view_name;
    }

    public String getClass_name() {
        return class_name;
    }

    public String getDepartment_name() {
        return department_name;
    }

    public String getFaculty_name() {
        return faculty_name;
    }

    public Integer getSelect_language() {
        return select_language;
    }

    public int getChars_count() {
        return chars_count;
    }

    public int getRows_count() {
        return rows_count;
    }

    public BigDecimal getScore() {
        return score;
    }

    public int getMin_time() {
        return min_time;
    }
}

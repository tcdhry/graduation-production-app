package com.krc.pgr.response;

import java.util.List;
import java.util.Map;

public class ViewAnswerDetailResponse extends ResponseBase {
    private int user_id;
    private String user_name;
    private Integer student_number;
    private Integer class_id;
    private String class_name;
    private Integer department_id;
    private String department_name;
    private Integer faculty_id;
    private String faculty_name;
    private int select_language;
    private int rows_count;
    private int chars_count;
    private String insert_timestamp;
    private String source_code;
    private List<Map<String, Object>> executions;

    public ViewAnswerDetailResponse() {
    }

    public ViewAnswerDetailResponse(Map<String, Object> answer, String source_code, List<Map<String, Object>> executions) {
        this.user_id = (int) answer.get("user_id");
        this.user_name = (String) answer.get("user_name");
        this.student_number = (Integer) answer.get("student_number");
        this.class_id = (Integer) answer.get("class_id");
        this.class_name = (String) answer.get("class_name");
        this.department_id = (Integer) answer.get("department_id");
        this.department_name = (String) answer.get("department_name");
        this.faculty_id = (Integer) answer.get("faculty_id");
        this.faculty_name = (String) answer.get("faculty_name");
        this.select_language = (int) answer.get("select_language");
        this.rows_count = (int) answer.get("rows_count");
        this.chars_count = (int) answer.get("chars_count");
        this.insert_timestamp = (String) answer.get("insert_timestamp");
        this.source_code = source_code;
        this.executions = executions;
    }

    public ViewAnswerDetailResponse(int user_id, String user_name, Integer student_number, Integer class_id, String class_name, Integer department_id, String department_name, Integer faculty_id, String faculty_name, int select_language, int rows_count, int chars_count, String insert_timestamp, String source_code, List<Map<String, Object>> executions) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.student_number = student_number;
        this.class_id = class_id;
        this.class_name = class_name;
        this.department_id = department_id;
        this.department_name = department_name;
        this.faculty_id = faculty_id;
        this.faculty_name = faculty_name;
        this.select_language = select_language;
        this.rows_count = rows_count;
        this.chars_count = chars_count;
        this.insert_timestamp = insert_timestamp;
        this.source_code = source_code;
        this.executions = executions;
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

    public int getSelect_language() {
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

    public String getSource_code() {
        return source_code;
    }

    public List<Map<String, Object>> getExecutions() {
        return executions;
    }
}

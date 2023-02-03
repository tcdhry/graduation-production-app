package com.krc.pgr.response;

import java.util.List;
import java.util.Map;

import com.krc.pgr.constant.Language;

public class ViewOtherUserAnswerResponse extends ResponseBase {
    private boolean success;
    private int user_id;
    private String user_view_name;
    private Integer student_number;
    private String class_name;
    private String department_name;
    private String faculty_name;
    private Integer select_language;
    private int rows_count;
    private int chars_count;
    private String insert_timestamp;
    private String source_code;
    private List<Map<String, Object>> executions;// {exec_time:number, exec_status_id:number}

    public ViewOtherUserAnswerResponse() {
        success = false;
    }

    public ViewOtherUserAnswerResponse(Map<String, Object> answer, Language select_language, String source_code, List<Map<String, Object>> executions) {
        this.success = true;
        this.user_id = (int) answer.get("user_id");
        this.user_view_name = (String) answer.get("user_view_name");
        this.student_number = (Integer) answer.get("student_number");
        this.class_name = (String) answer.get("class_name");
        this.department_name = (String) answer.get("department_name");
        this.faculty_name = (String) answer.get("faculty_name");
        this.select_language = select_language.getId();
        this.rows_count = (int) answer.get("rows_count");
        this.chars_count = (int) answer.get("chars_count");
        this.insert_timestamp = (String) answer.get("insert_timestamp");
        this.source_code = source_code;
        this.executions = executions;
    }

    public boolean getSuccess() {
        return success;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUser_view_name() {
        return user_view_name;
    }

    public Integer getStudent_number() {
        return student_number;
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

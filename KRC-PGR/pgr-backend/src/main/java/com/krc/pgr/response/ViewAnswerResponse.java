package com.krc.pgr.response;

import java.util.List;
import java.util.Map;

public class ViewAnswerResponse extends ResponseBase {
    private boolean success;
    private String question_title;
    private Integer select_language;
    private int rows_count;
    private int chars_count;
    private String timestamp;
    private String source_code;
    private List<Map<String, Object>> executions;// {exec_time:number, exec_status_id:number}

    public ViewAnswerResponse() {
        success = false;
    }

    public ViewAnswerResponse(String question_title, Integer select_language, int rows_count, int chars_count, String timestamp, String source_code, List<Map<String, Object>> executions) {
        success = true;
        this.question_title = question_title;
        this.select_language = select_language;
        this.rows_count = rows_count;
        this.chars_count = chars_count;
        this.timestamp = timestamp;
        this.source_code = source_code;
        this.executions = executions;
    }

    public ViewAnswerResponse(String question_title, Integer select_language, int rows_count, int chars_count, String timestamp, String source_code) {
        success = true;
        this.question_title = question_title;
        this.select_language = select_language;
        this.rows_count = rows_count;
        this.chars_count = chars_count;
        this.timestamp = timestamp;
        this.source_code = source_code;
    }

    public boolean getSuccess() {
        return success;
    }

    public String getQuestion_title() {
        return question_title;
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

    public String getTimestamp() {
        return timestamp;
    }

    public String getSource_code() {
        return source_code;
    }

    public List<Map<String, Object>> getExecutions() {
        return executions;
    }
}

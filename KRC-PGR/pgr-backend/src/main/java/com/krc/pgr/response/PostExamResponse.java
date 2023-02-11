package com.krc.pgr.response;

public class PostExamResponse extends ResponseBase {
    private boolean success;
    private int exam_id;
    private String uuid;

    public PostExamResponse() {
        this.success = false;
    }

    public PostExamResponse(int exam_id, String uuid) {
        this.success = true;
        this.exam_id = exam_id;
        this.uuid = uuid;
    }

    public boolean getSuccess() {
        return success;
    }

    public int getExam_id() {
        return exam_id;
    }

    public String getUuid() {
        return uuid;
    }
}

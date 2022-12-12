package com.krc.pgr.bean;

public class PostQuestionError {
    private String errorTarget;
    private String errorMessage;

    public PostQuestionError(String errorTarget, String errorMessage) {
        this.errorTarget = errorTarget;
        this.errorMessage = errorMessage;
    }

    public String getErrorTarget() {
        return errorTarget;
    }

    public void setErrorTarget(String errorTarget) {
        this.errorTarget = errorTarget;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
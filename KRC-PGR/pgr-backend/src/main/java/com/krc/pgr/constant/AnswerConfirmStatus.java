package com.krc.pgr.constant;

public enum AnswerConfirmStatus {
    SUCCESS(0), NOT_FOUND(1), NOT_VIEWING_SESSION(2), LANGUAGE_ERROR(3);

    private int status;

    AnswerConfirmStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}

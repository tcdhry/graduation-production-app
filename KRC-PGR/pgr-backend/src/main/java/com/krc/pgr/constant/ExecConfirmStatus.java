package com.krc.pgr.constant;

public enum ExecConfirmStatus {
    SUCCESS(0), NOT_FOUND(1), NOT_VIEWING_SESSION(2), SOURCE_CODE_NOT_INPUT(3), LANGUAGE_ERROR(4);

    private int status;

    ExecConfirmStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
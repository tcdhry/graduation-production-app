package com.krc.pgr.constant;

public enum ChangeViewNameStatus {
    SUCCESS(0), LONGER(1), WHITESPACE_ONLY(2);

    private int status;

    ChangeViewNameStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}

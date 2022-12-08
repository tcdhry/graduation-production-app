package com.krc.pgr.constant;

public enum ResponseStatus {
    SUCCESS(0), SESSION_ERROR(1), RUN_TIME_ERROR(2), INSUFFICIENT_AUTHORITY(3);

    private int responseStatus;

    ResponseStatus(int responseStatus) {
        this.responseStatus = responseStatus;
    }

    public int getResponseStatus() {
        return this.responseStatus;
    }
}
package com.krc.pgr.constant;

public enum SearchQuestionsStatus {
    SUCCESS(0), INPUT_VALUE_ERROR(1), NOT_HIT(2), OVER_PAGE(3);

    private int status;

    SearchQuestionsStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}

package com.krc.pgr.response;

import com.krc.pgr.constant.ResponseStatus;

public class ResponseBase {
    /**
     * @formatter:off
     * 全Responseはこれを継承させる。
     * status:
     * 0 = 正常終了
     * 1 = セッション切れ
     * 2 = 実行時エラー
     * を返す。
     * @formatter:on
     */
    private ResponseStatus status = ResponseStatus.SUCCESS;
    private String errorMessage = null;

    public ResponseBase() {
    }

    public ResponseBase(ResponseStatus responseStatus) {
        this.status = responseStatus;
    }

    public ResponseBase(String errorMessage) {
        this.status = ResponseStatus.RUN_TIME_ERROR;
        this.errorMessage = errorMessage;
    }

    public int getStatus() {
        return status.getResponseStatus();
    }

    public void setStatus(ResponseStatus status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
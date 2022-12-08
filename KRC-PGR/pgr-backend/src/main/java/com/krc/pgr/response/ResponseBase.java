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
    private int status = 0;
    private String errorMessage = null;

    public ResponseBase() {
    }

    public ResponseBase(ResponseStatus responseStatus) {
        this.status = responseStatus.getResponseStatus();
    }

    public ResponseBase(String errorMessage) {
        this.status = ResponseStatus.RUN_TIME_ERROR.getResponseStatus();
        this.errorMessage = errorMessage;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
package com.krc.pgr.response;

import com.krc.pgr.constant.ChangePasswordStatus;

public class ChangePasswordResponse extends ResponseBase {
    private String changeMessage;

    public ChangePasswordResponse() {
        this.changeMessage = ChangePasswordStatus.SUCCESS.getMessage();
    }

    public ChangePasswordResponse(ChangePasswordStatus status) {
        this.changeMessage = status.getMessage();
    }

    public String getChangeMessage() {
        return changeMessage;
    }
}

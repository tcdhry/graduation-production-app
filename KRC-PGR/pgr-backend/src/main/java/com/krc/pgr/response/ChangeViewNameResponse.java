package com.krc.pgr.response;

import com.krc.pgr.constant.ChangeViewNameStatus;

public class ChangeViewNameResponse extends ResponseBase {
    private int changeStatus;

    public ChangeViewNameResponse() {
        this.changeStatus = ChangeViewNameStatus.SUCCESS.getStatus();
    }

    public ChangeViewNameResponse(ChangeViewNameStatus status) {
        this.changeStatus = status.getStatus();
    }

    public int getChangeStatus() {
        return changeStatus;
    }
}

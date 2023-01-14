package com.krc.pgr.response;

import com.krc.pgr.constant.ChangeViewNameStatus;

public class ChangeViewNameResponse extends ResponseBase {
    private ChangeViewNameStatus changeStatus;

    public ChangeViewNameResponse() {
        this.changeStatus = ChangeViewNameStatus.SUCCESS;
    }

    public ChangeViewNameResponse(ChangeViewNameStatus status) {
        this.changeStatus = status;
    }

    public int getChangeStatus() {
        return changeStatus.getStatus();
    }
}

package com.krc.pgr.response;

import java.util.List;

import com.krc.pgr.bean.ExecStatus;
import com.krc.pgr.constant.ExecConfirmStatus;

public class ExecConfirmResponse extends ResponseBase {
    ExecConfirmStatus execConfirmStatus;
    List<ExecStatus> execList;

    public ExecConfirmResponse(ExecConfirmStatus execConfirmStatus) {
        this.execConfirmStatus = execConfirmStatus;
        this.execList = null;
    }

    public ExecConfirmResponse(List<ExecStatus> execList) {
        this.execConfirmStatus = ExecConfirmStatus.SUCCESS;
        this.execList = execList;
    }

    public int getExecConfirmStatus() {
        return execConfirmStatus.getStatus();
    }

    public List<ExecStatus> getExecList() {
        return execList;
    }
}

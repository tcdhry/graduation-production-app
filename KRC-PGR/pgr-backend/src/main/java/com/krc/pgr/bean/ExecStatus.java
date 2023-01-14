package com.krc.pgr.bean;

import com.krc.pgr.constant.ExecStatusCode;

public class ExecStatus {
    private ExecStatusCode execStatusCode;
    private String output;

    public ExecStatus(ExecStatusCode execStatusCode, String output) {
        this.execStatusCode = execStatusCode;
        this.output = output;
    }

    public ExecStatus(ExecStatusCode execStatusCode) {
        this.execStatusCode = execStatusCode;
        this.output = null;
    }

    public int getExecStatusCode() {
        return execStatusCode.getId();
    }

    public String getOutput() {
        return output;
    }
}

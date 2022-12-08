package com.krc.pgr.bean;

import com.krc.pgr.constant.ExecStatusCode;

public class ExecStatus {
    private ExecStatusCode execStatusCode;
    private String output;

    ExecStatus(ExecStatusCode execStatusCode, String output) {
        this.execStatusCode = execStatusCode;
        this.output = output;
    }

    public ExecStatusCode getExecStatusCode() {
        return execStatusCode;
    }

    public String getOutput() {
        return output;
    }
}

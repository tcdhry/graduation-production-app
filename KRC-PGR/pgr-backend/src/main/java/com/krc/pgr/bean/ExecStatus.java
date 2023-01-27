package com.krc.pgr.bean;

import com.krc.pgr.constant.ExecStatusCode;

public class ExecStatus {
    private ExecStatusCode execStatusCode;
    private String output;
    private long execTime;

    public ExecStatus(ExecStatusCode execStatusCode, String output) {
        this.execStatusCode = execStatusCode;
        this.output = output;
    }

    public ExecStatus(ExecStatusCode execStatusCode, String output, long execTime) {
        this.execStatusCode = execStatusCode;
        this.output = output;
        this.execTime = execTime;
    }

    public ExecStatus(ExecStatusCode execStatusCode) {
        this.execStatusCode = execStatusCode;
        this.output = null;
    }

    public ExecStatus(ExecStatusCode execStatusCode, long execTime) {
        this.execStatusCode = execStatusCode;
        this.execTime = execTime;
    }

    public int getExecStatusCode() {
        return execStatusCode.getId();
    }

    public String getOutput() {
        return output;
    }

    public long getExecTime() {
        return execTime;
    }
}

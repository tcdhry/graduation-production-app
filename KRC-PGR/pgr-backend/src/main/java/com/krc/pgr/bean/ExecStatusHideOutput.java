package com.krc.pgr.bean;

public class ExecStatusHideOutput {
    private ExecStatus execStatus;

    public ExecStatusHideOutput(ExecStatus execStatus) {
        this.execStatus = execStatus;
    }

    public int getExecStatusCode() {
        return execStatus.getExecStatusCode();
    }

    public long getExecTime() {
        return execStatus.getExecTime();
    }
}

package com.krc.pgr.response;

public class TitleCheckResponse extends ResponseBase {
    boolean notExistTitle;

    public TitleCheckResponse(boolean notExistTitle) {
        this.notExistTitle = notExistTitle;
    }

    public boolean getNotExistTitle() {
        return notExistTitle;
    }
}

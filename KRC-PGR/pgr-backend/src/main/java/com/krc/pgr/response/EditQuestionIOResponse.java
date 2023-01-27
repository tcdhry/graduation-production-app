package com.krc.pgr.response;

public class EditQuestionIOResponse extends ResponseBase {
    boolean errorFlag;

    public EditQuestionIOResponse(boolean errorFlag) {
        this.errorFlag = errorFlag;
    }

    public boolean getErrorFlag() {
        return errorFlag;
    }
}

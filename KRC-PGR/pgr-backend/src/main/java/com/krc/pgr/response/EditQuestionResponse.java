package com.krc.pgr.response;

import java.util.ArrayList;

import com.krc.pgr.bean.PostQuestionError;

public class EditQuestionResponse extends ResponseBase {
    ArrayList<PostQuestionError> errorList;

    public EditQuestionResponse(ArrayList<PostQuestionError> errorList) {
        this.errorList = errorList;
    }

    public EditQuestionResponse() {
        errorList = null;
    }

    public ArrayList<PostQuestionError> getErrorList() {
        return errorList;
    }
}

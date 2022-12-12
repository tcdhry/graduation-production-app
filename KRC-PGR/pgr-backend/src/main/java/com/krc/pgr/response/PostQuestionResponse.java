package com.krc.pgr.response;

import java.util.ArrayList;

import com.krc.pgr.bean.PostQuestionError;

public class PostQuestionResponse extends ResponseBase {
    private ArrayList<PostQuestionError> errorList;
    private Integer generatedId;

    public PostQuestionResponse(int generatedId) {
        this.errorList = null;
        this.generatedId = generatedId;
    }

    public PostQuestionResponse(ArrayList<PostQuestionError> errorList) {
        this.errorList = errorList;
        this.generatedId = null;
    }

    public ArrayList<PostQuestionError> getErrorList() {
        return errorList;
    }

    public Integer getGeneratedId() {
        return generatedId;
    }
}

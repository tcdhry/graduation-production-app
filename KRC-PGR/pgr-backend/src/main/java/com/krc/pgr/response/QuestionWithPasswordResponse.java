package com.krc.pgr.response;

import com.krc.pgr.bean.Question;

public class QuestionWithPasswordResponse extends ResponseBase {
    Question question;

    public QuestionWithPasswordResponse() {
        question = null;
    }

    public QuestionWithPasswordResponse(Question question) {
        this.question = question;
    }

    public Question getQuestion() {
        return question;
    }

}

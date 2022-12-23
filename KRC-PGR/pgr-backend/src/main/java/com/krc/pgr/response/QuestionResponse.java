package com.krc.pgr.response;

import com.krc.pgr.bean.Question;
import com.krc.pgr.bean.QuestionThumbnail;

public class QuestionResponse extends ResponseBase {
    private Question question = null;
    private QuestionThumbnail thumbnail = null;

    public QuestionResponse() {
    }

    public QuestionResponse(Question question) {
        this.question = question;
    }

    public QuestionResponse(QuestionThumbnail thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Question getQuestion() {
        return question;
    }

    public QuestionThumbnail getThumbnail() {
        return thumbnail;
    }
}
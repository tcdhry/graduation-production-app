package com.krc.pgr.response;

import com.krc.pgr.constant.AnswerConfirmStatus;

public class AnswerConfirmResponse extends ResponseBase {
    AnswerConfirmStatus answerConfirmStatus;

    public AnswerConfirmResponse(AnswerConfirmStatus answerConfirmStatus) {
        this.answerConfirmStatus = answerConfirmStatus;
    }

    public int getAnswerConfirmStatus() {
        return answerConfirmStatus.getStatus();
    }
}

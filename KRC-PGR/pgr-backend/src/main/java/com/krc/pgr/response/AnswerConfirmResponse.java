package com.krc.pgr.response;

import com.krc.pgr.constant.AnswerConfirmStatus;

public class AnswerConfirmResponse extends ResponseBase {
    AnswerConfirmStatus answerConfirmStatus;

//    List<ExecStatusHideOutput> execStatusesHideOutput;

    public AnswerConfirmResponse(AnswerConfirmStatus answerConfirmStatus) {
        this.answerConfirmStatus = answerConfirmStatus;
    }

    public AnswerConfirmResponse() {
        answerConfirmStatus = AnswerConfirmStatus.SUCCESS;
    }
//    public AnswerConfirmResponse(List<ExecStatusHideOutput> execStatusHideOutput) {
//        answerConfirmStatus = AnswerConfirmStatus.SUCCESS;
//        this.execStatusesHideOutput = execStatusHideOutput;
//    }

    public int getAnswerConfirmStatus() {
        return answerConfirmStatus.getStatus();
    }

//    public List<ExecStatusHideOutput> getExecStatusesHideOutput() {
//        return execStatusesHideOutput;
//    }
}

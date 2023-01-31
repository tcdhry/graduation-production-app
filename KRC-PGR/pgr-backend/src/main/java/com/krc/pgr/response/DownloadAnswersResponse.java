package com.krc.pgr.response;

import java.util.List;

import com.krc.pgr.bean.DLAnswerBean;

public class DownloadAnswersResponse extends ResponseBase {
    private boolean errorFlag;
    private List<DLAnswerBean> answers;

    public DownloadAnswersResponse() {
        errorFlag = true;
        answers = null;
    }

    public DownloadAnswersResponse(List<DLAnswerBean> answers) {
        errorFlag = false;
        this.answers = answers;
    }

    public boolean getErrorFlag() {
        return errorFlag;
    }

    public List<DLAnswerBean> getAnswers() {
        return answers;
    }
}

package com.krc.pgr.response;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.bean.AnswerBean;

public class ViewAnswersResponse extends ResponseBase {
    private boolean errorFlag;
    private String question_title;
    private List<AnswerBean> answers;

    public ViewAnswersResponse() {
        this.errorFlag = true;
    }

    public ViewAnswersResponse(String question_title, List<Map<String, Object>> list) throws SQLException {
        this.errorFlag = false;
        this.question_title = question_title;
        this.answers = new ArrayList<>();
        for (Map<String, Object> map : list) {
            answers.add(new AnswerBean(map));
        }
    }

    public boolean getErrorFlag() {
        return errorFlag;
    }

    public String getQuestion_title() {
        return question_title;
    }

    public List<AnswerBean> getAnswers() {
        return answers;
    }
}

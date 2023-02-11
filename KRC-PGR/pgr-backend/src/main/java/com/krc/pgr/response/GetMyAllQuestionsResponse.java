package com.krc.pgr.response;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.krc.pgr.bean.SimpleMyQuestionBean;

public class GetMyAllQuestionsResponse extends ResponseBase {
    private List<SimpleMyQuestionBean> questions;

    public GetMyAllQuestionsResponse(List<Map<String, Object>> questions) {
        this.questions = questions.stream().map(row -> new SimpleMyQuestionBean(row)).collect(Collectors.toList());
    }

    public List<SimpleMyQuestionBean> getQuestions() {
        return questions;
    }
}

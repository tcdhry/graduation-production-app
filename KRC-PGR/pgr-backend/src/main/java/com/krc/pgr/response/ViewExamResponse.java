package com.krc.pgr.response;

import java.util.List;
import java.util.Map;

import com.krc.pgr.bean.ExamQuestionsBean;

public class ViewExamResponse extends ResponseBase {
    private boolean notFound;
    private ExamQuestionsBean exam;

    private ViewExamResponse() {
    }

    public ViewExamResponse(Map<String, Object> examData, List<Map<String, Object>> questions) {
        exam = new ExamQuestionsBean(examData, questions);
    }

    public static ViewExamResponse notFound() {
        ViewExamResponse res = new ViewExamResponse();
        res.notFound = true;
        return res;
    }

    public boolean isNotFound() {
        return notFound;
    }

    public ExamQuestionsBean getExam() {
        return exam;
    }
}

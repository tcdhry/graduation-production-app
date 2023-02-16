package com.krc.pgr.response;

import java.sql.SQLException;

import com.krc.pgr.bean.ExamDetailBean;

public class GetMyExamResponse extends ResponseBase {
    private ExamDetailBean exam;

    public GetMyExamResponse() {
    }

    public GetMyExamResponse(ExamDetailBean exam) throws SQLException {
        this.exam = exam;
    }

    public ExamDetailBean getExam() {
        return exam;
    }
}

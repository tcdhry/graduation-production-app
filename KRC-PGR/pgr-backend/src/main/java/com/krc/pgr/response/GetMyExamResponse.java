package com.krc.pgr.response;

import java.sql.SQLException;

import com.krc.pgr.bean.ExamBean;

public class GetMyExamResponse extends ResponseBase {
    private ExamBean exam;

    public GetMyExamResponse() {
    }

    public GetMyExamResponse(ExamBean exam) throws SQLException {
        this.exam = exam;
    }

    public ExamBean getExam() {
        return exam;
    }
}

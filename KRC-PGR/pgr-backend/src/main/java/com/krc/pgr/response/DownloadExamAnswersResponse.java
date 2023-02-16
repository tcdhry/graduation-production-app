package com.krc.pgr.response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.bean.DLAnswerBean;

public class DownloadExamAnswersResponse extends ResponseBase {
    private List<DLExamAnswerBean> answers;

    public DownloadExamAnswersResponse() {
        answers = null;
    }

    public DownloadExamAnswersResponse(List<Map<String, Object>> list) {
        answers = new ArrayList<>();
        for (Map<String, Object> map : list) {
            try {
                // 1つのファイルで読み取りエラーが発生するだけで全部ダウンロードできなくなるとアレなのでtry-catchする
                answers.add(new DLExamAnswerBean(map, (int) map.get("question_id")));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public List<DLExamAnswerBean> getAnswers() {
        return answers;
    }
}

class DLExamAnswerBean extends DLAnswerBean {
    private int sort_index;

    public DLExamAnswerBean(Map<String, Object> map, int question_id) throws IOException {
        super(map, question_id);
        this.sort_index = (int) map.get("sort_index");
    }

    public int getSort_index() {
        return sort_index;
    }
}
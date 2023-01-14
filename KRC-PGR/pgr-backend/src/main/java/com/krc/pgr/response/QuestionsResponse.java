package com.krc.pgr.response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.bean.QuestionThumbnail;
import com.krc.pgr.constant.SearchQuestionsStatus;
import com.krc.pgr.util.LimitQuery;

public class QuestionsResponse extends ResponseBase {
    private SearchQuestionsStatus searchStatus;
    private List<QuestionThumbnail> questions = new ArrayList<>();
    private int hitCount;
    private int maxPage;

    public QuestionsResponse(List<Map<String, Object>> list) {
        this.searchStatus = SearchQuestionsStatus.SUCCESS;
        if (list.size() != 0) {
            this.hitCount = (int) list.get(0).get("hit_count");
            this.maxPage = LimitQuery.calcMaxPage(this.hitCount);
            for (Map<String, Object> m : list) {
                questions.add(new QuestionThumbnail(m));
            }
        }
    }

    public QuestionsResponse(SearchQuestionsStatus status) {
        this.searchStatus = status;
    }

    public int getSearchStatus() {
        return searchStatus.getStatus();
    }

    public List<QuestionThumbnail> getQuestions() {
        return questions;
    }

    public int getHitCount() {
        return hitCount;
    }

    public int getMaxPage() {
        return maxPage;
    }
}
package com.krc.pgr.response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.bean.RankingRowBean;

public class RankingResponse extends ResponseBase {
    private boolean not_found = false;
    private boolean password_required = false;
    private boolean private_answer_mode = false;
    private String question_title;
    private List<RankingRowBean> ranking;

    /*
     * factory methodパターンを使用することでenumの作成の手間を省く。
     * JSON変換の際にgetterとして認識させないために、メソッド名をget~等にはしない。
     * getter認識の条件
     * ・メソッド名がget~, is~
     * ・void以外の戻り値を持つ
     * ・引数が無し
     */
    public static RankingResponse notFoundResponse() {
        RankingResponse res = new RankingResponse();
        res.not_found = true;
        return res;
    }

    public static RankingResponse passwordRequiredResponse() {
        RankingResponse res = new RankingResponse();
        res.password_required = true;
        return res;
    }

    public static RankingResponse privateAnswerResponse() {
        RankingResponse res = new RankingResponse();
        res.private_answer_mode = true;
        return res;
    }

    private RankingResponse() {
    }

    public RankingResponse(String question_title, List<Map<String, Object>> list) {
        this.question_title = question_title;
        this.ranking = new ArrayList<>();
        for (Map<String, Object> row : list) {
            this.ranking.add(new RankingRowBean(row));
        }
    }

    public boolean getNot_found() {
        return not_found;
    }

    public boolean getPassword_required() {
        return password_required;
    }

    public boolean getPrivate_answer_mode() {
        return private_answer_mode;
    }

    public String getQuestion_title() {
        return question_title;
    }

    public List<RankingRowBean> getRanking() {
        return ranking;
    }
}

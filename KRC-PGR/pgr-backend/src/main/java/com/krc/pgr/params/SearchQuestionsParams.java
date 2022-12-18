package com.krc.pgr.params;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.TF;

public class SearchQuestionsParams {
    private String title;
    private String poster_id;
    private List<Integer> language;
    private TF scoring;
    private TF answered;
    private TF password;
    private String sort;
    private int page;

    public SearchQuestionsParams(Map<String, Object> params) throws Exception {
        /**
         * 問題検索の入力値処理。
         * 不正な入力値はExceptionを投げ、Actionに処理させる。
         * どの項目でエラーかはやってられんので区別できない仕様。
         * 
         * nullが格納された場合、絞り込みを行わない項目とする。
         */

        String title = (String) params.get("title");
        this.title = "".equals(title) ? null : title;

        // 入力が無ければnullを格納、有ればint変換を試行。失敗でエラーを投げる。
        String poster_id = (String) params.get("poster_id");
        this.poster_id = ("".equals(poster_id) || poster_id == null) ? null : poster_id;

        if (params.get("language") == null) {
            this.language = null;
        } else {
            this.language = new ArrayList<>();
            for (String lang : ((String) params.get("language")).split("\\.")) {
                if ("null".equals(lang)) {
                    /**
                     * sqlで比較する際、language_designation in (null, 1, 2)
                     * が機能しないため、null = -1 とおく。
                     */
                    this.language.add(-1);
                } else {
                    // 不正入力値をvalueOfかparseIntで検知。
                    this.language.add(Language.valueOf(Integer.parseInt(lang)).getId());
                }
            }
            if ((Language.values().length + 1) == this.language.size()) {
                // (全実装言語数 + null) の数がリストの数と一致すれば絞り込み無しにする。
                this.language = null;
            }
        }

        this.scoring = switchTF(params, "scoring");
        this.answered = switchTF(params, "answered");
        this.password = switchTF(params, "password");

        this.sort = "old".equals((String) params.get("sort")) ? "old" : null;

        this.page = params.get("page") == null ? 1 : Integer.parseInt((String) params.get("page"));
    }

    private TF switchTF(Map<String, Object> params, String key) throws Exception {
        String val = (String) params.get(key);
        if (val == null || "tf".equals(val)) {
            return TF.TF;
        }

        if ("t".equals(val)) {
            return TF.T;
        }
        if ("f".equals(val)) {
            return TF.F;
        }
        if ("".equals(val)) {
            return TF.NULL;
        }

        throw new Exception();
    }

    public String getTitle() {
        return title;
    }

    public String getPoster_id() {
        return poster_id;
    }

    public List<Integer> getLanguage() {
        return language;
    }

    public TF getScoring() {
        return scoring;
    }

    public TF getAnswered() {
        return answered;
    }

    public TF getPassword() {
        return password;
    }

    public String getSort() {
        return sort;
    }

    public int getPage() {
        return page;
    }
}

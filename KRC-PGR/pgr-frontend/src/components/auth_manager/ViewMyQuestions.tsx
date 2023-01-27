import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Questions } from "../../beans/QuestionBean";
import { SearchQuestionsParams, switchTF, TF } from "../../beans/SearchQuestionsParams";
import { Languages } from "../../constants/Language";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { SearchStatus } from "../../constants/SearchStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import Pager from "../global_components/Pager";
import QuestionsListView from "../global_components/QuestionsListView";
import SearchQuestionsForm from "../global_components/SearchQuestionsForm";
import SearchStatusView from "../global_components/SearchStatusView";
import queryString from "query-string";


const defaultParams: SearchQuestionsParams = {
    title: '',
    poster_id: '',// 自分の問題一覧なのでこのページでは無視する。
    language: ['null', ...Languages.map((language) => { return String(language.language_id) })],
    scoring: new TF(),
    answered: new TF(),
    password: new TF(),
    sort: 'new',
    page: 1
};

function ViewMyQuestions() {
    const [params, setParams] = useState<SearchQuestionsParams>({ ...defaultParams });
    const [questions, setQuestions] = useState<Questions>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchStatus, setSearchStatus] = useState(SearchStatus.LOADING);
    const [hitCount, setHitCount] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    useEffect(() => {
        const queryParams = queryString.parse(location.search);
        const newParams = { ...defaultParams };
        // メソッドに参照渡しするためにobjectにする
        const errorFlag = { flag: false };
        /**
         * queryParams.xxx: string | null | [string | null]
         * ------------------------------------------------------------
         * | queryString  | xxx           | typeof xxx  | 対応        |
         * |--------------|---------------|-------------|-------------|
         * | ?yyy         | undefined     | 'undefined' | default val |
         * | ?xxx         | null          | 'object'    | default val |
         * | ?xxx=        | ''            | 'string'    | .xxx val    |
         * | ?xxx=aaa     | 'aaa'         | 'string'    | .xxx val    |
         * | ?xxx=aaa&xxx | ['aaa', null] | 'object'    | throw error |
         * ------------------------------------------------------------
         * 
         * 補足
         * .xxx valの場合、選択肢にない値であった場合もエラーを投げる。
         * 配列の判定には、`xxx instanceof Array` を使用してnullとの区別をする。
         */
        if (typeof queryParams.title === 'string') {
            newParams.title = queryParams.title;
        } else if (queryParams.title instanceof Array) {
            errorFlag.flag = true;
        }

        if (typeof queryParams.poster_id === 'string') {
            newParams.poster_id = queryParams.poster_id;
        } else if (queryParams.poster_id instanceof Array) {
            errorFlag.flag = true;
        }

        if (typeof queryParams.language === 'string') {
            newParams.language = queryParams.language.split('.');
        } else if (queryParams.language instanceof Array) {
            newParams.language = [];
            errorFlag.flag = true;
        }

        if (typeof queryParams.scoring === 'string') {
            newParams.scoring = switchTF(queryParams.scoring, errorFlag);
        } else if (queryParams.scoring instanceof Array) {
            newParams.scoring = { t: false, f: false };
            errorFlag.flag = true;
        }

        if (typeof queryParams.answered === 'string') {
            newParams.answered = switchTF(queryParams.answered, errorFlag);
        } else if (queryParams.answered instanceof Array) {
            newParams.answered = { t: false, f: false };
            errorFlag.flag = true;
        }

        if (typeof queryParams.password === 'string') {
            newParams.password = switchTF(queryParams.password, errorFlag);
        } else if (queryParams.password instanceof Array) {
            newParams.password = { t: false, f: false };
            errorFlag.flag = true;
        }

        if (typeof queryParams.sort === 'string') {
            if (queryParams.sort === 'new' || queryParams.sort === 'old') {
                newParams.sort = queryParams.sort;
            } else {
                newParams.sort = 'new';
                errorFlag.flag = true;
            }
        } else if (queryParams.sort instanceof Array) {
            errorFlag.flag = true;
        }

        if (typeof queryParams.page === 'string') {
            try {
                newParams.page = Number.parseInt(queryParams.page);
                if (newParams.page <= 0) {
                    errorFlag.flag = true;
                }
            } catch (error) {
                errorFlag.flag = true;
            }
        }

        setParams({ ...newParams });

        if (errorFlag.flag) {
            alert('入力値エラー。検索フォームから再試行してください。');
        } else {
            type MyQuestionsResponse = ResponseBase & {
                data: {
                    searchStatus: number,
                    questions: Questions,
                    hitCount: number,
                    maxPage: number
                }
            };
            axios.get(generateAPI(API.Manager._, API.Manager.viewMyQuestions), {
                params: {
                    title: queryParams.title,
                    poster_id: queryParams.poster_id,
                    language: queryParams.language,
                    scoring: queryParams.scoring,
                    answered: queryParams.answered,
                    password: queryParams.password,
                    sort: queryParams.sort,
                    page: queryParams.page,
                }
            }).then((res: MyQuestionsResponse) => {
                receiveResponse(res, navigate, function () {
                    setSearchStatus(res.data.searchStatus);
                    setQuestions(res.data.questions);
                    setHitCount(res.data.hitCount);
                    setMaxPage(res.data.maxPage);
                    document.getElementById('search-status')!.scrollIntoView({ behavior: 'smooth' });
                });
            }).catch(catchError);
        }
    }, [location.search, navigate]);

    return (
        <>
            <SearchQuestionsForm />
            <SearchStatusView searchStatus={searchStatus} hitCount={hitCount} maxPage={maxPage} nowPage={params.page} />
            <Pager searchStatus={searchStatus} hitCount={hitCount} maxPage={maxPage} nowPage={params.page} />
            <QuestionsListView questions={questions} toURL={generateURL(URL.Manager._, URL.Manager.editQuestion)} myQuestions={true} />
            <Pager searchStatus={searchStatus} hitCount={hitCount} maxPage={maxPage} nowPage={params.page} />
        </>
    );
}

export default ViewMyQuestions;
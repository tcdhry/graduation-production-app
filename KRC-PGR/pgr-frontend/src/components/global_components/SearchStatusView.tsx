import { Link, useLocation } from "react-router-dom";
import { SearchStatus } from "../../constants/SearchStatus";
import queryString from "query-string";

function SearchStatusView(props: { searchStatus: SearchStatus, hitCount: number, maxPage: number, nowPage: number }) {
    const params = queryString.parse(useLocation().search);
    return (
        <div id="search-status">
            {
                function () {
                    switch (props.searchStatus) {
                        case SearchStatus.LOADING:
                            return (<>検索中。。。</>);
                        case SearchStatus.NOT_HIT:
                            return (<>1件もヒットしない検索条件です。検索フォームから再検索してください。</>);
                        case SearchStatus.OVER_PAGE:
                            return (<>ページ指定が範囲外かもしれません。<Link to={'?' + queryString.stringify({ ...params, page: 1 })}>page=1</Link>を試してください。</>);
                        case SearchStatus.SUCCESS:
                            return (<>{props.hitCount}件ヒット　ページ：{props.nowPage} / {props.maxPage}</>);
                        case SearchStatus.INPUT_VALUE_ERROR:
                            return (<>不正な入力値が検知されました。検索フォームから再検索してください。</>);
                        default:
                            return (<></>);
                    }
                }()
            }
        </div>
    );
};

export default SearchStatusView;
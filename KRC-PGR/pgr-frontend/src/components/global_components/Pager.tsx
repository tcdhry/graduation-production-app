import { Link, useLocation } from "react-router-dom";
import { SearchStatus } from "../../constants/SearchStatus";
import queryString from "query-string";

function Pager(props: { searchStatus: SearchStatus, hitCount: number, maxPage: number, nowPage: number }) {
    const params = queryString.parse(useLocation().search);
    return (
        <nav className="pager">
            {
                function () {
                    const list: Array<JSX.Element> = [];
                    for (let i = 1; i <= props.maxPage; i++) {
                        list.push(<Link key={i} to={'?' + queryString.stringify({ ...params, page: i })} className={props.nowPage === i ? 'now-page' : undefined}>{i}</Link>);
                    }
                    return list;
                }()
            }
        </nav>
    );
};

export default Pager;
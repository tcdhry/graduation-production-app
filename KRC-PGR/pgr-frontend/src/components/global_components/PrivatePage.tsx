import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { AuthorityID } from "../../constants/Authority";
import { generateURL, URL } from "../../constants/URL";
import { State } from "../../redux/store";

function PrivatePage(props: { permit: Array<AuthorityID>, outlet: ReactElement }) {
    const user = useSelector((state: State) => state.loginUser.user);

    const [child, setChild] = useState(<></>);
    const location = useLocation();

    useEffect(() => {
        if (user !== null) {
            if (props.permit.includes(user.authority_id)) {
                setChild(<>{props.outlet}</>);
            } else {
                setChild(<><Navigate to={generateURL(URL.Guest.insufficientAuthorityError)} /></>);
            }
        } else {
            setChild(<><Navigate to={generateURL(URL.Guest.sessionError)} /></>);
        }
        /**
         * `useEffect` 第二引数について。
         * URL直打ちでアクセスした場合、セッションチェックが非同期処理で走る。
         * そのため、上記処理が実行されるタイミングでは、セッションが確立されていてもログインがされていない判定になる。
         * これに対処するため、URL(location.pathname)のだけでなく、user(redux)の変更のタイミングも依存リストに追加する。
         * 
         * props.permit, props.outletはリンタに警告されたので追加した。
         */
    }, [location.pathname, user, props.permit, props.outlet]);

    return (
        <>
            {child}
        </>
    )
}

export default PrivatePage;
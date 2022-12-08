// import logo from "../../logo.png";
import logo from "../../logo.svg";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getUserViewName, UserBean } from "../../beans/UserBean";
import { generateURL, URL } from "../../constants/URL";
import { State } from "../../redux/store";
import { Authority } from "../../constants/Authority";
import { useEffect, useState } from "react";


function GuestNav() {
    return (
        <>
            <Link to={generateURL(URL.Guest.login)}><span>ログイン</span></Link>
        </>
    );
}

function NavItem(props: { permit: Array<Authority>, authority_id: number, url: string, authority_name: string, innerText: string, current: string }) {
    if (props.permit.includes(props.authority_id)) {
        return (
            <Link to={props.url} id={props.current === props.authority_name ? 'current' : undefined}>
                <span>{props.innerText}</span>
            </Link>
        );
    } else {
        return null;
    }
}

function UserNav(props: { user: UserBean }) {
    /*
     * インデックスのリンクと横並びでログアウトがあると
     * ユーザビリティ的に誤クリックが起きやすいためコメントアウト
     * そもそもログアウトの機能が必要かは要検討
     **/
    // const { logout } = loginUserSlice.actions;
    // const dispatch = useDispatch();

    const [parentNode, setParentNode] = useState('');
    const location = useLocation();

    useEffect(() => {
        // `/krcpgr/admin/~` の `admin` の部分を取得する。(必要権限毎に変わる設計)
        const parent = location.pathname.split('/')[2];
        setParentNode(parent);
    }, [location.pathname]);


    return (
        <>
            {/* <Link to={generateURL(URL.Guest.login)} onClick={function () {
                axios.get(generateAPI(API.Guest.logout)).then(() => {
                    dispatch(logout());
                });
            }}><span>ログアウト</span></Link> */}
            <NavItem
                permit={[Authority.Admin]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.Admin._, URL.Admin.index)}
                authority_name={'admin'}
                innerText={'管理者'}
                current={parentNode}
            />
            <NavItem
                permit={[Authority.Admin, Authority.Manager]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.Manager._, URL.Manager.index)}
                authority_name={'manager'}
                innerText={'運営者'}
                current={parentNode}
            />
            <NavItem
                permit={[Authority.Admin, Authority.Manager, Authority.User]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.User._, URL.User.index)}
                authority_name={'user'}
                innerText={'ユーザ'}
                current={parentNode}
            />
        </>
    );
}

function logoURL(authority_id: undefined | number) {
    switch (authority_id) {
        case Authority.Admin:
            return generateURL(URL.Admin._, URL.Admin.index);
        case Authority.Manager:
            return generateURL(URL.Manager._, URL.Manager.index);
        case Authority.User:
            return generateURL(URL.User._, URL.User.index);
        default:
            return generateURL(URL.Guest.login);
    }
}

function Header() {
    const user = useSelector((state: State) => state.loginUser.user);

    return (
        <>
            <header>
                <div id="header-left">
                    <h1>
                        <Link to={logoURL(user?.authority_id)}>
                            <img src={logo} alt="logo" id="logo-img" />
                        </Link>
                    </h1>
                </div>
                <div id="header-center">
                    <div id="login-user">
                        {user === null ? <>未ログイン</> : <>ようこそ {getUserViewName(user)}<br />権限：{user?.authority_name}</>}
                    </div>
                </div>
                <div id="header-right">
                    {user === null ? <GuestNav /> : <UserNav user={user} />}
                </div>
            </header>
        </>
    );
}

export default Header;
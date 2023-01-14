// import logo from "../../logo.svg";
// import logo from "../../nijuwamitsuya.svg";
import Logo from "../../nijuwamitsuya";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getUserViewName, UserBean } from "../../beans/UserBean";
import { generateURL, URL } from "../../constants/URL";
import { State } from "../../redux/store";
import { Authority, AuthorityID, AuthorityJapaneseName, AuthorityName } from "../../constants/Authority";
import { useEffect, useState } from "react";


function GuestNav() {
    return (
        <>
            <Link to={generateURL(URL.Guest.login)}><span>ログイン</span></Link>
        </>
    );
}

function NavItem(props: { permit: Array<AuthorityID>, authority_id: number, url: string, authority_name: AuthorityName, innerText: AuthorityJapaneseName, current: string }) {
    if (props.permit.includes(props.authority_id)) {
        return (
            /**
             * /user配下のページに居る場合、ユーザのリンクに#currentを付与する。
             * 他権限も同様。
             * ただしユーザ権限でログインしている場合は/user配下以外にアクセスしないため付与しない。
             */
            <Link to={props.url} id={(props.authority_id !== AuthorityID.User && props.current === props.authority_name) ? 'current' : undefined}>
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
                permit={[Authority.Admin.id]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.Admin._, URL.Admin.index)}
                authority_name={Authority.Admin.name}
                innerText={Authority.Admin.ja}
                current={parentNode}
            />
            <NavItem
                permit={[Authority.Admin.id, Authority.Manager.id]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.Manager._, URL.Manager.index)}
                authority_name={Authority.Manager.name}
                innerText={Authority.Manager.ja}
                current={parentNode}
            />
            <NavItem
                permit={[Authority.Admin.id, Authority.Manager.id, Authority.User.id]}
                authority_id={props.user.authority_id}
                url={generateURL(URL.User._, URL.User.index)}
                authority_name={Authority.User.name}
                innerText={Authority.User.ja}
                current={parentNode}
            />
        </>
    );
}

function logoURL(authority_id: undefined | number) {
    switch (authority_id) {
        case AuthorityID.Admin:
            return generateURL(URL.Admin._, URL.Admin.index);
        case AuthorityID.Manager:
            return generateURL(URL.Manager._, URL.Manager.index);
        case AuthorityID.User:
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
                            {/* <img src={logo} alt="logo" id="logo-img" /> */}
                            <Logo />
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
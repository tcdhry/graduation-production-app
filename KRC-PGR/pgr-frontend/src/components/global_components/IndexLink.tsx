import { Link } from "react-router-dom";

function IndexLink(props: { to: string, value: string, icon: JSX.Element }) {
    /**
     * 表示の関係上、valueの上限は全角12文字
     */
    return (
        <Link to={props.to} className='index-link'>
            <div className="link-icon">
                {props.icon}
            </div>
            <div className="link-text">
                {props.value}
            </div>
        </Link>
    );
}

export default IndexLink;
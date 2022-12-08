import { Link } from "react-router-dom";
import { generateURL, URL } from "../../constants/URL";
import { Row, Col } from "../util_components/24ColLayout";

function InsufficientAuthorityError() {
    return (
        <>
            <Row>
                <Col>
                    <h2>権限不足エラー</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        アカウントの権限が足りません。<br />
                        権限が足りるアカウントでログインしなおしてください。
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to={generateURL(URL.Guest.login)} className="btn btn-full">ログイン</Link>
                </Col>
            </Row>
        </>
    );
}

export default InsufficientAuthorityError;
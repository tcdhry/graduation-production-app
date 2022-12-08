import { Link } from "react-router-dom";
import { generateURL, URL } from "../../constants/URL";
import { Row, Col } from "../global_components/24ColLayout";

function SessionError() {
    return (
        <>
            <Row>
                <Col>
                    <h2>セッションエラー</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        セッションの持続時間切れです。<br />
                        ログインしなおしてください。
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

export default SessionError;
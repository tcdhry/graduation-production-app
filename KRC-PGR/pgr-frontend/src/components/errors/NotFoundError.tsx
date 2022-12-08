import { Row, Col } from "../util_components/24ColLayout";

function NotFoundError() {
    return (
        <>
            <Row>
                <Col>
                    <h2>404エラー</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        このページは存在しません。
                    </p>
                </Col>
            </Row>
        </>
    );
}

export default NotFoundError;
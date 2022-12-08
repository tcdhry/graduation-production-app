import { Row, Col } from "../global_components/24ColLayout";

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
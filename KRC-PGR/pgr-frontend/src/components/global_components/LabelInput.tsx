import { Row, Col } from "./24ColLayout";

function LabelInput(props: { label: JSX.Element, input: JSX.Element, label_width: number }) {
    return (
        <Row>
            <Col width={props.label_width}>
                {props.label}
            </Col>
            <Col width={24 - props.label_width}>
                {props.input}
            </Col>
        </Row>
    );
}

export default LabelInput;
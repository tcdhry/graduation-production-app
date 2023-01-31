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

export function LabelCheckbox(props: { value: string, id: string, name: string, labelText: string, defaultChecked: boolean, onChange?: React.ChangeEventHandler<HTMLInputElement> }) {
    return (
        <span className="label-checkbox">
            <input type="checkbox" value={props.value} id={props.id} name={props.name} defaultChecked={props.defaultChecked} onChange={props.onChange} />
            <label htmlFor={props.id}>{props.labelText}</label>
        </span>
    );
}

export function LabelRadio(props: { value: string, id: string, name: string, labelText: string, defaultChecked: boolean }) {
    return (
        <span className="label-radio">
            <input type="radio" value={props.value} id={props.id} name={props.name} defaultChecked={props.defaultChecked} />
            <label htmlFor={props.id}>{props.labelText}</label>
        </span>
    );
}
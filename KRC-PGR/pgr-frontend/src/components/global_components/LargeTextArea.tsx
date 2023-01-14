import { ChangeEventHandler } from "react";

export function LargeTextArea(props: { id: string, onChange: ChangeEventHandler<HTMLTextAreaElement>, maxLength: number, defaultValue: string | null }) {
    return (
        <textarea rows={10} id={props.id} name={props.id} onChange={props.onChange} maxLength={props.maxLength} defaultValue={props.defaultValue === null ? '' : props.defaultValue} />
    );
}
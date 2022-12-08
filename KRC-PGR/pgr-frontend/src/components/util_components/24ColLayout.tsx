import { ReactNode } from "react";

export function Row(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <div className="row">
            {props.children}
        </div>
    );
}

export function Col(props: { children: ReactNode, width?: number, offset?: number }) {
    /**
     * 横24分割中なんぼ使うかをwidthで指定。
     * 参考：bootstrap
     */

    return (
        <div className={('col-' + (props.width === undefined ? 24 : props.width)) + (props.offset !== undefined ? (' offset-' + props.offset) : '')}>
            {props.children}
        </div>
    )
}
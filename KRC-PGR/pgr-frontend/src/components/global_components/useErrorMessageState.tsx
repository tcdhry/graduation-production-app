import { useState } from "react";

function useErrorMessageState(defaultMessage?: string): [React.ReactElement, (message: string) => void] {
    const [state, setState] = useState(<p>{defaultMessage ? defaultMessage : '　'}</p>);
    function setStateWrap(message: string) {
        setState(<p>　</p>);
        window.setTimeout(() => {
            setState(<p className="error-message">{message}</p>);
        }, 1);
    }
    return [state, setStateWrap];
}

export default useErrorMessageState;
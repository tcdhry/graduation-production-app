import { useCookies } from "react-cookie";

const cookieKey = 'select-style-id';

function useCookieWrap(): [string, (value: string) => void] {
    const [cookies, setCookie] = useCookies([cookieKey]);
    function setCookieWrap(value: string) {
        setCookie(cookieKey, value, { path: '/' });
    }
    return [cookies[cookieKey], setCookieWrap];
}

export default useCookieWrap;
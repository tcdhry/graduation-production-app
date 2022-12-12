import { Link } from "react-router-dom";

function SmoothScrollLink(props: { toID: string, children: any }) {
    return (
        <Link
            to={'#' + props.toID}
            onClick={() => {
                const element = document.getElementById(props.toID);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }}
            className="text-link double-quotation"
        >
            {props.children}
        </Link>
    )
}

export default SmoothScrollLink;
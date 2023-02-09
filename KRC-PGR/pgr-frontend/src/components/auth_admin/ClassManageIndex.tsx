import { AiFillEdit, AiOutlinePlusSquare } from "react-icons/ai";
import { generateURL, URL } from "../../constants/URL";
import IndexLink from "../global_components/IndexLink";

function ClassManageIndex() {
    return (
        <>
            <nav id="index-nav">
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.classManage, URL.Admin.newClass)} value='新規クラス' icon={<AiOutlinePlusSquare />} />
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.classManage, URL.Admin.updateClass)} value='クラス更新' icon={<AiFillEdit />} />
            </nav>
        </>
    );
}

export default ClassManageIndex;
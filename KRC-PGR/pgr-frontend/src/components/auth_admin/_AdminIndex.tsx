import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdManageAccounts } from "react-icons/md"
import { generateURL, URL } from "../../constants/URL";
import IndexLink from "../global_components/IndexLink";

function AdminIndex() {
    return (
        <>
            <nav id="index-nav">
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.bulkRegUser)} value='ユーザ 一括登録' icon={<AiOutlineUsergroupAdd />} />
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.accountManage)} value='アカウント管理' icon={<MdManageAccounts />} />
            </nav>
        </>
    );
}

export default AdminIndex;
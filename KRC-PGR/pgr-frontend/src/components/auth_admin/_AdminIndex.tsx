import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { GiPalette } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md"
import { generateURL, URL } from "../../constants/URL";
import IndexLink from "../global_components/IndexLink";

function AdminIndex() {
    return (
        <>
            <nav id="index-nav">
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.bulkRegUser)} value='ユーザ 一括登録' icon={<AiOutlineUsergroupAdd />} />
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.accountManage)} value='アカウント管理' icon={<MdManageAccounts />} />
                <IndexLink to={generateURL(URL.Admin._, URL.Admin.styleManage)} value='スタイルセット管理' icon={<GiPalette />} />
            </nav>
        </>
    );
}

export default AdminIndex;
import { Outlet } from "react-router-dom";
import { Authority } from "../../constants/Authority";
import PrivatePage from "../global_components/PrivatePage";

function UserUniform() {
    return (
        <>
            <div id="user-page">
                <PrivatePage permit={[Authority.Admin.id, Authority.Manager.id, Authority.User.id]} outlet={<Outlet />} />
            </div>
        </>
    );
}

export default UserUniform;
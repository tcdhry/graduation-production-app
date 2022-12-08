import { Outlet } from "react-router-dom";

function UserUniform() {
    return (
        <>
        <div id="user-page">
            <Outlet />
        </div>
        </>
    );
}

export default UserUniform;
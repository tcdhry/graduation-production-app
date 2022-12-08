import { Outlet } from "react-router-dom";

function AdminUniform() {
    return (
        <>
            <div id="admin-page">
                <Outlet />
            </div>
        </>
    );
}

export default AdminUniform;
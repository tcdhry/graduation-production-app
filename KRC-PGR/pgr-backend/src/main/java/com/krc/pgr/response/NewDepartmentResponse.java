package com.krc.pgr.response;

public class NewDepartmentResponse extends ResponseBase {
    private boolean success;

    public static NewDepartmentResponse error() {
        NewDepartmentResponse res = new NewDepartmentResponse();
        res.success = false;
        return res;
    }

    public static NewDepartmentResponse success() {
        NewDepartmentResponse res = new NewDepartmentResponse();
        res.success = true;
        return res;
    }

    public boolean getSuccess() {
        return success;
    }
}

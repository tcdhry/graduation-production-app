package com.krc.pgr.response;

public class SuccessFlagResponse extends ResponseBase {
    private boolean success;

    public static SuccessFlagResponse error() {
        SuccessFlagResponse res = new SuccessFlagResponse();
        res.success = false;
        return res;

    }

    public static SuccessFlagResponse success() {
        SuccessFlagResponse res = new SuccessFlagResponse();
        res.success = true;
        return res;
    }

    public boolean getSuccess() {
        return success;
    }
}

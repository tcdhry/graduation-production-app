package com.krc.pgr.constant;

public enum Authority {
    GUEST(-1), USER(0), MANAGER(1), ADMIN(2);

    private int authority_id;

    Authority(int authority_id) {
        this.authority_id = authority_id;
    }

    public int getAuthority() {
        return this.authority_id;
    }
}

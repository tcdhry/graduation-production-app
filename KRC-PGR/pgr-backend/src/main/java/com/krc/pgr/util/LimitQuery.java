package com.krc.pgr.util;

public class LimitQuery {
    private final static int LIMIT = 30;

    public static String limitString(int page) {
        return " limit " + LIMIT + " offset " + (LIMIT * (page - 1));
    }

    public static int calcMaxPage(int hit_count) {
        return (int) Math.ceil((double) hit_count / LIMIT);
    }
}

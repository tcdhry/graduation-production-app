package com.krc.pgr.util;

import java.sql.SQLException;

import org.postgresql.jdbc.PgArray;

public class Converter {
    public static String[] castPgArray_str(Object obj) throws SQLException {
        return obj == null ? null : (String[]) ((PgArray) obj).getArray();
    }

    public static Integer[] castPgArray_int(Object obj) throws SQLException {
        return obj == null ? null : (Integer[]) ((PgArray) obj).getArray();
    }
}

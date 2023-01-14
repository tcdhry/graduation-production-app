package com.krc.pgr.util;

import java.sql.SQLException;

import org.postgresql.jdbc.PgArray;

public class Converter {
    public static String[] castPgArray(Object obj) throws SQLException {
        return (String[]) ((PgArray) obj).getArray();
    }
}

package com.krc.pgr.util;

import java.math.BigInteger;
import java.security.MessageDigest;

public class PasswordManage {
    public static String hash(String plainPassword) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        digest.reset();
        digest.update(plainPassword.getBytes("utf8"));
        return String.format("%064x", new BigInteger(1, digest.digest()));
    }
}

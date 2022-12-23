package com.krc.pgr.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class PasswordManage {
    public static String hash(String plainPassword) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        digest.reset();
        digest.update(plainPassword.getBytes("utf8"));
        return String.format("%064x", new BigInteger(1, digest.digest()));
    }
}

package com.krc.pgr.runtime;

import java.io.IOException;

import com.krc.pgr.constant.SourceFileName;

public class JavaRuntime extends RuntimeManage {
    private static String sourceFileName = SourceFileName.Java.getFileName();
    private static String execFileName = "Main";
    final static private String ENCODING = "Shift_JIS";

    private JavaRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    public static JavaRuntime execConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new JavaRuntime(question_id, user_id, sourceCode, true);
    }

    public static JavaRuntime answerConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new JavaRuntime(question_id, user_id, sourceCode, false);
    }

    protected String generateCompileCommand() {
        /**
         * javac -encoding UTF-8 \pgr-codes\q1\u2009011\Main.java (--release 8)
         * 
         * エラー: この文字(0x87)は、エンコーディングwindows-31jにマップできません
         * 回避のためエンコードを指定する。
         * ENCODINGとは別。
         */
        return "javac -encoding UTF-8 " + directory + sourceFileName;
    }

    protected String generateExecCommand() {
        /**
         * java -classpath \pgr-codes\q1\u2009011\ Main
         */
        return "java -classpath " + directory + " " + execFileName;
    }
}
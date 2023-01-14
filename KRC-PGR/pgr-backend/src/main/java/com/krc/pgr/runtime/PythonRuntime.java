package com.krc.pgr.runtime;

import java.io.IOException;

public class PythonRuntime extends RuntimeManage {
    private static String sourceFileName = "Main.py";
    private static String execFileName = "Main.py";
    final static private String ENCODING = "Shift_JIS";

    public PythonRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    protected String generateCompileCommand() {
        /**
         * スクリプト言語のためnullを返す。
         */
        return null;
    }

    protected String generateExecCommand() {
        /**
         * python \pgr-codes\q1\u2009011\Main.py
         */
        return "python " + directory + execFileName;
    }
}
package com.krc.pgr.runtime;

import java.io.IOException;

import com.krc.pgr.constant.SourceFileName;

public class PythonRuntime extends RuntimeManage {
    private static String sourceFileName = SourceFileName.Python.getFileName();
    private static String execFileName = "Main.py";
    final static private String ENCODING = "Shift_JIS";

    private PythonRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    public static PythonRuntime execConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new PythonRuntime(question_id, user_id, sourceCode, true);
    }

    public static PythonRuntime answerConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new PythonRuntime(question_id, user_id, sourceCode, false);
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
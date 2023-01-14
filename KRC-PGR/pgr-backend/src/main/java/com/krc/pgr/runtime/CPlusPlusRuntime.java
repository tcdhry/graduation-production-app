package com.krc.pgr.runtime;

import java.io.IOException;

public class CPlusPlusRuntime extends RuntimeManage {
    private static String sourceFileName = "Main.cpp";
    private static String execFileName = "Program.exe";
    final static private String ENCODING = "Shift_JIS";

    public CPlusPlusRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    protected String generateCompileCommand() {
        /**
         * g++ -o \pgr-codes\q1\u2009011\Main.exe \pgr-codes\q1\u2009011\Main.cpp
         */
        return "g++ -o " + directory + execFileName + " " + directory + sourceFileName;
    }

    protected String generateExecCommand() {
        /**
         * \pgr-codes\q1\u2009011\Main.exe
         */
        return directory + execFileName;
    }
}
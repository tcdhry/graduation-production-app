package com.krc.pgr.runtime;

import java.io.IOException;

import com.krc.pgr.constant.SourceFileName;

public class CPlusPlusRuntime extends RuntimeManage {
    private static String sourceFileName = SourceFileName.CPlusPlus.getFileName();
    private static String execFileName = "Program.exe";
    final static private String ENCODING = "Shift_JIS";

    private CPlusPlusRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    public static CPlusPlusRuntime execConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new CPlusPlusRuntime(question_id, user_id, sourceCode, true);
    }

    public static CPlusPlusRuntime answerConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new CPlusPlusRuntime(question_id, user_id, sourceCode, false);
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
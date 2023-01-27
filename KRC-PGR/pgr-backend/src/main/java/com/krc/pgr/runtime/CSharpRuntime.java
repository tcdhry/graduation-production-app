package com.krc.pgr.runtime;

import java.io.IOException;

import com.krc.pgr.constant.SourceFileName;

public class CSharpRuntime extends RuntimeManage {
    private static String sourceFileName = SourceFileName.CSharp.getFileName();
    private static String execFileName = "Program.exe";
    final static private String ENCODING = "Shift_JIS";

    private CSharpRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    public static CSharpRuntime execConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new CSharpRuntime(question_id, user_id, sourceCode, true);
    }

    public static CSharpRuntime answerConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new CSharpRuntime(question_id, user_id, sourceCode, false);
    }

    protected String generateCompileCommand() {
        /**
         * csc /out:\pgr-codes\q1\u2009011\Program.exe \pgr-codes\q1\u2009011\Program.cs
         */
        return "csc /out:" + directory + execFileName + " " + directory + sourceFileName;
    }

    protected String generateExecCommand() {
        /**
         * \pgr-codes\q1\u2009011\Program.exe
         */
        return super.directory + execFileName;
    }
}
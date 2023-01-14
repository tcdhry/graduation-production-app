package com.krc.pgr.runtime;

import java.io.IOException;

public class CSharpRuntime extends RuntimeManage {
    private static String sourceFileName = "Program.cs";
    private static String execFileName = "Program.exe";
    final static private String ENCODING = "Shift_JIS";

    public CSharpRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
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
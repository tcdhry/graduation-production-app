package com.krc.pgr.runtime;

import java.io.IOException;

public class RubyRuntime extends RuntimeManage {
    private static String sourceFileName = "Main.rb";
    private static String execFileName = "Main.rb";
    final static private String ENCODING = "UTF-8";

    public RubyRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
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
         * ruby \pgr-codes\q1\u2009011\Main.rb
         */
        return "ruby " + directory + execFileName;
    }
}
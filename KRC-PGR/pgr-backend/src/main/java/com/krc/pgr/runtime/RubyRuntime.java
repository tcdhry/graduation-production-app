package com.krc.pgr.runtime;

import java.io.IOException;

import com.krc.pgr.constant.SourceFileName;

public class RubyRuntime extends RuntimeManage {
    private static String sourceFileName = SourceFileName.Ruby.getFileName();
    private static String execFileName = "Main.rb";
    final static private String ENCODING = "UTF-8";

    private RubyRuntime(int question_id, int user_id, String sourceCode, boolean execConfirm) throws IOException {
        super(question_id, user_id, sourceFileName, sourceCode, ENCODING, execConfirm);
    }

    public static RubyRuntime execConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new RubyRuntime(question_id, user_id, sourceCode, true);
    }

    public static RubyRuntime answerConfirm(int question_id, int user_id, String sourceCode) throws IOException {
        return new RubyRuntime(question_id, user_id, sourceCode, false);
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
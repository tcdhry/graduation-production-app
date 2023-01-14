package com.krc.pgr.runtime;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.concurrent.TimeUnit;

import com.krc.pgr.bean.ExecStatus;
import com.krc.pgr.constant.ExecStatusCode;
import com.krc.pgr.util.FileManage;

public abstract class RuntimeManage {
//    final static private String CODES_PATH = "\\pgr-codes\\tests\\";
    private String encoding;

    // "q{question_id}\\u{user_id}\\"
    protected String directory;
    private Runtime runtime = Runtime.getRuntime();

    protected RuntimeManage(int question_id, int user_id, String sourceFileName, String sourceCode, String encoding, boolean execConfirm) throws IOException {
        if (execConfirm == true) {
            this.directory = FileManage.generateSubmitFilePath(question_id, user_id);
        } else {
            this.directory = FileManage.generateSubmitFilePath(question_id, user_id);
        }
        this.encoding = encoding;
        this.createSourceFile(sourceFileName, sourceCode);
    }

    /**
     * ↓2つを子クラスで実装する。
     * スクリプト言語の場合、generateCompileCommandはnullを返すように実装する。
     */
    protected abstract String generateCompileCommand();

    protected abstract String generateExecCommand();

    private void createSourceFile(String sourceFileName, String sourceCode) throws IOException {
        FileManage.createFile(directory + sourceFileName, sourceCode);
    }

    private ExecStatus compile(String compileCommand) throws IOException {
        if (compileCommand == null) {
            /**
             * コンパイルコマンドが無い = スクリプト言語の場合、何もせずAcceptedで返却する。
             */
            return new ExecStatus(ExecStatusCode.ACCEPTED);
        }
        // Compile code
        Process compileProcess = runtime.exec(compileCommand);

        try {
            // Wait end of process
            compileProcess.waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (compileProcess.exitValue() != 0) {
            // Compile Error
            InputStream inputStream = compileProcess.getErrorStream();
            String output = readStream(inputStream);

            return new ExecStatus(ExecStatusCode.COMPILATION_ERROR, output);
        }

        return new ExecStatus(ExecStatusCode.ACCEPTED);
    }

    private ExecStatus run(String runCommand, String input, String expectedOutput) throws IOException {
        Process runProcess = runtime.exec(runCommand);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream(), encoding));
        if (input != null) {
            bw.write(input);
        }
        bw.flush();

        try {
            runProcess.waitFor(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            // Time out check
            runProcess.exitValue();
        } catch (IllegalThreadStateException e) {
            // Time Limit Exceeded when runProcess.exitValue = "not exit"
            return new ExecStatus(ExecStatusCode.TIME_LIMIT_EXCEEDED);
        }

        InputStream inputStream;
        if (runProcess.exitValue() == 0) {
            // Run success
            inputStream = runProcess.getInputStream();
        } else {
            // Error
            inputStream = runProcess.getErrorStream();
        }

        String output = readStream(inputStream);

        /**
         * TODO
         * 想定出力無しの場合、nullが格納されているが
         * "".equals(null)がfalseになるので正常に判定できないと思われる。
         */
        if (output.equals(expectedOutput)) {
            return new ExecStatus(ExecStatusCode.ACCEPTED, output);
        } else {
            return new ExecStatus(ExecStatusCode.WRONG_ANSWER, output);
        }
    }

    private String readStream(InputStream inputStream) throws IOException {
        InputStreamReader reader = new InputStreamReader(inputStream, encoding);
        BufferedReader br = new BufferedReader(reader);

        String output = "";
        String rst;
        while ((rst = br.readLine()) != null) {
            output += rst + "\n";
        }

        return output;
    }

    public ExecStatus compileAndExec(String input, String expectedOutput) throws IOException {
        String compileCommand = generateCompileCommand();
        if (compileCommand != null) {
            ExecStatus compileStatus = compile(compileCommand);
            if (compileStatus.getExecStatusCode() != ExecStatusCode.ACCEPTED.getId()) {
                return compileStatus;
            }
        }

        return run(generateExecCommand(), input, expectedOutput);
    }
}
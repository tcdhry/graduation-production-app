package com.krc.pgr.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;

public class FileManage {
    /*
     * C: と / 一部コマンドで使用できないため \ に統一
     */
    public final static String TOP_DIRECTORY = "\\pgr-codes\\";
    public final static String TESTS_DIRECTORY = "tests\\";
    public final static String SUBMITS_DIRECTORY = "submits\\";

    public static String generateSourceFolderDirectory(int question_id, int user_id) {
        // "q{question_id}\\u{user_id}\\{file_name}"
        return "q" + question_id + "\\u" + user_id + "\\";
    }

    public static String generateTestFolderDirectory(int question_id, int user_id) {
        return TOP_DIRECTORY + TESTS_DIRECTORY + generateSourceFolderDirectory(question_id, user_id);
    }

    public static String generateSubmitFolderDirectory(int question_id, int user_id) {
        return TOP_DIRECTORY + SUBMITS_DIRECTORY + generateSourceFolderDirectory(question_id, user_id);
    }

    public static void createFile(String path, String content) throws IOException {
        // Create new file object
        File file = new File(path);

        // Create directory
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }

        // Create file
        file.delete();
        file.createNewFile();

        // Write source code
        FileWriter fw = new FileWriter(path);
        fw.write(content);
        fw.close();
    }

    public static void deleteFile(String path) {
        File file = new File(path);
        file.delete();
    }

    public static String readFile(String path) throws IOException {
        File file = new File(path);
        FileInputStream fis = new FileInputStream(file);
        byte[] data = new byte[(int) file.length()];
        fis.read(data);
        fis.close();
        return new String(data, "UTF-8");
    }
}

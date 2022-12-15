package com.krc.pgr.constant;

public enum ChangePasswordStatus {
    SUCCESS("変更が完了しました。"), SHORTER("パスワードが短すぎます。10文字以上にしてください。"), NOT_ENTER("新規パスワードが入力されていません。"), NOT_MATCH("新規パスワードと（確認）が一致しません。");

    private String message;

    ChangePasswordStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}

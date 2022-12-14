function ServerDownError() {
    /**
     * フロントサーバは動いているが、バックサーバが停止している場合にたどり着くレアケース。
     */
    return (
        <>
            <h3>リクエストエラー</h3>
            サーバの応答が停止している可能性があります。<br />
            ページのリロードを試すか、管理者に問い合わせてください。<br/>
            (ヘッダ内のリンクは動作しません。)
        </>
    );
}

export default ServerDownError;
package com.krc.pgr.aspect;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.UserBean;
import com.krc.pgr.response.ResponseBase;
import com.krc.pgr.util.SessionManage;


@Component
@Aspect
public class SessionAspect {
    @Autowired
    private SessionManage session;

    @Around(value = "execution(* com.krc.pgr.controller.*.*(..))")
    public ResponseBase sessionCheck(ProceedingJoinPoint pjp) {
//        <T extends ResponseBase> T
//        UserBean user = session.getLoginUser();
//        if (user == null) {
//            // セッション切れの場合はnullを返す
//            return null;
//        }

        try {
            return (ResponseBase) pjp.proceed();
        } catch (Throwable t) {
            return new ResponseBase();
        }
    }
}
// /**
//     * @formatter:off
//     * 
//     * コントローラの必須要件
//     * ・@RestController アノテーション
//     * ・@Permit アノテーション
//     * ・戻り値はResponseBaseかvoidの2択
//     * 
//     * 
//     * SessionError時とRunTimeError時には、ResponseBaseにエラーのステータスコードを格納して返す。
//     * 正常終了の場合はメソッドの戻り値を返す。
//     * 
//     * メソッドの戻り値はResponseBaseかvoidに統一。
//     * メソッド内部でResponseBaseを継承したクラスをreturnさせる。
//     * 
//     * 戻り値をResponseBaseを継承したクラスそのものにすると、
//     * エラー時にAOPでResponseBaseを返す処理がキャストできずにエラーになる。
//     * 
//     * ResponseBaseをメソッドの戻り値の型にダウンキャストすれば返せると思うがやり方が一切わからなかった。
//     * 懸念点として、メソッドの戻り値がResponseBase以上の詳細な型指定ができないため、
//     * 継承したオブジェクトであれば好き勝手なんでも返せてしまう。
//     * 
//     * 一部必須要件を忘れてもコンパイル余裕で通るのが最大の設計欠陥。
//     * 
//     * @formatter:on
//     */
//    @Autowired
//    private HttpSession session;
//
//    // ResponseBase+) && @annotation(org.springframework.web.bind.annotation.RestController
//    @Around(value = "execution(* com.krc.progrun.controller.*.*(..))") // within(クラス名)
//    public ResponseBase sessionCheck(ProceedingJoinPoint pjp) {
//        UserBean user = SessionManage.getLoginUser(session);
//
//        int authority_id;
//        if (user == null) {
//            // session が切れていたら判定用にゲスト権限を与える。
//            authority_id = Authority.GUEST.getAuthority();
//        } else {
//            authority_id = user.getAuthority_id();
//        }
//
//        if (isPermit(pjp, authority_id) == false) {
//            if (authority_id == Authority.GUEST.getAuthority()) {
//                // ユーザの権限が許可されていないクラスだった場合、セッションエラーのレスポンスを渡す。
//                return new ResponseBase(ResponseStatus.SESSION_ERROR);
//            } else {
//                // ログイン済みの場合、権限不足エラーのレスポンスを返す。
//                return new ResponseBase(ResponseStatus.INSUFFICIENT_AUTHORITY);
//            }
//        }
//
//        try {
//            return (ResponseBase) pjp.proceed();
//        } catch (Throwable t) {
//            return new ResponseBase(t);
//        }
//    }
//
//    private boolean isPermit(ProceedingJoinPoint pjp, int authority_id) {
//        Permit permitAnnotation = pjp.getTarget().getClass().getAnnotation(Permit.class);
//        Authority[] permit = permitAnnotation.authority();
//        for (Authority a : permit) {
//            if (a.getAuthority() == authority_id) {
//                return true;
//            }
//        }
//        return false;
//    }
//}
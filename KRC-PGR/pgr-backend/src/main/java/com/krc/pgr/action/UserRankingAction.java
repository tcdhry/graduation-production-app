package com.krc.pgr.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.response.DownloadAnswersResponse;
import com.krc.pgr.response.RankingResponse;
import com.krc.pgr.util.SessionManage;

@Component
public class UserRankingAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    public RankingResponse ranking(String question_id_str) {
        int question_id;
        try {
            question_id = Integer.parseInt(question_id_str);
        } catch (Exception e) {
            return new RankingResponse();
        }
        
        String sql = "select a.user_id, a.select_language, a.chars_count, a.rows_count,\r\n"
                + "(case when e.question_id is null then 1 else cast(count(case when exec_status_id = 0 then 1 else null end) as float) / count(exec_status_id) end * 100)::numeric(5,2) as score\r\n"
                + "from t_answers as a\r\n"
                + "left outer join t_executions as e on a.question_id = e.question_id and a.user_id = e.user_id\r\n"
                + "where a.question_id = 48\r\n"
                + "group by a.question_id, a.user_id, e.question_id\r\n"
                + "order by score desc, chars_count asc;\r\n"
                + "";
        
    }
}

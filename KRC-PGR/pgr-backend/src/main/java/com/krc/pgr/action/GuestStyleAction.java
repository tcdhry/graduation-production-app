package com.krc.pgr.action;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.response.StyleResponse;

@Component
public class GuestStyleAction {
    @Autowired
    JdbcTemplate jdbc;

    public StyleResponse getStyle(String styleName) {
        String sql = "select * from m_styles where style_id = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, styleName);
        if (list.size() == 0) {
            return new StyleResponse();
        }

        return new StyleResponse(list.get(0));
    }
}

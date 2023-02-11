package com.krc.pgr.action;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserStyleAction {
    @Autowired
    JdbcTemplate jdbc;

    public StylesResponse getStyles() {
        String sql = "select style_id, style_name from m_styles;";
        List<Map<String, Object>> list = jdbc.queryForList(sql);
        return new StylesResponse(list);
    }
}

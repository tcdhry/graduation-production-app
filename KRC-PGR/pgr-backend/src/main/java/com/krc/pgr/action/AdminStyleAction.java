package com.krc.pgr.action;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.response.ResponseBase;

@Component
public class AdminStyleAction {
    @Autowired
    JdbcTemplate jdbc;

    public StylesResponse getStyles() {
        String sql = "select * from m_styles;";
        List<Map<String, Object>> list = jdbc.queryForList(sql);
        return new StylesResponse(list);
    }

    public ResponseBase updateStyle(Map<String, Object> postParams) {
        String style_id = (String) postParams.get("style_id");
        String[] keys = { "style_name", "__header_bg_color", "__header_font_color", "__main_bg_color", "__main_font_color", "__footer_bg_color", "__footer_font_color", "__border_color", "__attention_font_color", "__warning_font_color", "__low_font_color", "__link_font_color", "__visited_link_color", "__btn_bg_color", "__btn_active_color", "__btn_font_color", "__btn_border_color", "__pager_hover_bg_color", "__pager_hover_font_color" };
        String sql = "update m_styles set " + Arrays.stream(keys).map(key -> key + " = ?").collect(Collectors.joining(", ")) + " where style_id = ?;";
        jdbc.update(sql, Stream.concat(Arrays.stream(keys).map(key -> postParams.get(key)), Stream.of(style_id)).toArray());
        return new ResponseBase();
    };
}

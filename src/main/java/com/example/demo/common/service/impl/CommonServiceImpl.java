package com.example.demo.common.service.impl;

import com.example.demo.common.mapper.CommonMapper;
import com.example.demo.common.service.CommonService;
import com.example.demo.util.config.TableWhiteListProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final CommonMapper commonMapper;

    private final TableWhiteListProperties tableProps;

    /** 드롭다운용 공통 조회 */
    @Override
    public List<Map<String, Object>> getSelectAll(String tableId) {
        // 테이블명 검증
        if (!tableProps.getAllowedTables().contains(tableId)) {
            throw new IllegalArgumentException("허용되지 않은 테이블: " + tableId);
        }

        // 테이블명 서버에서 강제 대문자 + 검증
        tableId = tableId.toUpperCase();

        // 메타 컬럼 조회
        List<Map<String, Object>> columns = commonMapper.selectColumns(tableId);

        // 안전한 SELECT 절을 미리 만들어서 넘긴다
        StringBuilder selectSql = new StringBuilder();

        for (Map<String, Object> col : columns) {

            String name = col.get("NAME").toString();
            String type = col.get("DATATYPE").toString();

            // 날짜/타임스탬프 컬럼은 제외
            if (type.contains("DATE") || type.contains("TIMESTAMP")) {
                continue;
            }

            selectSql.append(name).append(", ");
        }

        if (selectSql.length() == 0) {
            throw new RuntimeException("조회 가능한 컬럼이 없습니다.");
        }

        selectSql.setLength(selectSql.length() - 2);

        Map<String, Object> param = new HashMap<>();
        param.put("tableId", tableId);
        param.put("selectSql", selectSql.toString());

        return commonMapper.getSelectAll(param);
    }
}

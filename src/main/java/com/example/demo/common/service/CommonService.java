package com.example.demo.common.service;

import java.util.List;
import java.util.Map;

public interface CommonService {
    /**
     * 드롭다운용 공통 조회
     */
    List<Map<String, Object>> getSelectAll(String tableId);
}

package com.example.demo.util.pagination;

import java.util.HashMap;
import java.util.Map;

public class PaginationUtil {

    /**
     * MyBatis Mapper에 전달할 파라미터 생성
     */
    public static void addPaging(Map<String, Object> params) {
        int page = (int) params.getOrDefault("page", 1);
        int size = (int) params.getOrDefault("size", 10);

        int offset = (page - 1) * size;

        params.put("offset", offset);
        params.put("limit", size);
    }
}
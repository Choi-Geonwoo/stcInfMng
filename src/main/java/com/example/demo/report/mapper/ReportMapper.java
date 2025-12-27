package com.example.demo.report.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * report Mapper (MyBatis)
 * - DTO/VO 기반 DB 매핑
 */
@Mapper
public interface ReportMapper {

    /**
     * 모든 투자리포트 조회
     */
    List<Map<String, Object>> generateReport();
}

package com.example.demo.report.service;

import java.util.Map;


/**
 * report Service 인터페이스
 **/
public interface ReportService {

    /**
     * 모든 투자리포트 조회
     */
    Map<String, Object> generateReport() throws Exception;
}

package com.example.demo.report.controller;

import com.example.demo.dashboard.service.DashboardService;
import com.example.demo.report.service.ReportService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * report API Controller
 * - 클라이언트 요청을 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * AI 투자 리포트 뷰를 반환합니다.
     * @return AI 투자 리포트 뷰 경로
     */
    @GetMapping(value = {"/"})
    public String reportView() {
        return "view/report/reportView";
    }

    /**
     * 대시보드 요약 정보를 반환합니다.
     * @return 요약 정보 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/ai-report")
    public ResponseEntity<Map<String, Object>> generateReport() throws Exception {
        Map<String, Object> list = reportService.generateReport();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }
}

package com.example.demo.report.service.impl;

import com.example.demo.report.mapper.ReportMapper;
import com.example.demo.report.service.ReportService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * report Service 구현
 * - DTO/VO 기반 CRUD 처리
 */
@Slf4j
@Service
public class ReportServiceImpl implements ReportService {

    private final ReportMapper reportMapper;

    public ReportServiceImpl(ReportMapper reportMapper) {
        this.reportMapper = reportMapper;
    }

    /**
     * 모든 투자리포트 조회
     */
    @Override
    public Map<String, Object> generateReport() throws Exception {

            String json = new ObjectMapper().writeValueAsString(reportMapper.generateReport());
            log.info("####################################################################");
            log.info("# " + json);
        String prompt = """
너는 개인투자자의 AI 프라이빗뱅커다.
아래 데이터를 분석해서 오늘의 투자 리포트를 작성해라.
안정/성장/위험 종목과 향후 배당전망을 반드시 포함해라.

데이터:
%s
""".formatted(json);

        String body = new ObjectMapper().writeValueAsString(
                Map.of(
                        "model", "llama3",
                        "prompt", prompt,
                        "stream", false
                )
        );

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:11434/api/generate"))
                .header("Content-Type","application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        String response = HttpClient.newHttpClient()
                .send(req, HttpResponse.BodyHandlers.ofString())
                .body();

        System.out.println("AI RESPONSE ↓↓↓");
        System.out.println(response);

            log.info("####################################################################");
            return null ;
        }
}

/*
package com.example.demo.dvnApiCall.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OverseasDividendService {
    */
/**
     * Finnhub API 키
     * application.properties 파일에서 finnhub.api-key 값을 주입받습니다.
     *//*

    @Value("${finnhub.api-key}")
    private String apiKey;

    */
/**
     * RESTful API 호출을 위한 RestTemplate 인스턴스
     *//*

    private final RestTemplate restTemplate = new RestTemplate();

    */
/**
     * 특정 주식 심볼에 대한 배당금 정보를 Finnhub API에서 가져옵니다.
     *
     * @param symbol 주식 심볼 (예: "AAPL")
     * @return Finnhub API에서 반환된 배당금 정보를 담고 있는 Map 객체
     *//*

    public Map<String, Object> getDividend(String symbol) {
        String url = "https://finnhub.io/api/v1/stock/dividend?symbol="
                + symbol + "&token=" + apiKey;

        return restTemplate.getForObject(url, Map.class);
    }
}*/

package com.example.demo.dvnApiCall.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class DomesticDividendService {
    /**
     * Dart API 키
     */
    @Value("${dart.api-key}")
    private String apiKey;

    /**
     * REST API 호출을 위한 RestTemplate
     */
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 배당금 정보를 조회합니다.
     *
     * @param corpCode 회사 코드
     * @param year     사업 연도
     * @return 배당금 정보를 담은 Map 객체
     */
    public Map<String, Object> getDividend(String corpCode, String year) {

        String url = "https://opendart.fss.or.kr/api/fnlttSinglAcnt.json"
                + "?crtfc_key=" + apiKey
                + "&corp_code=" + corpCode
                + "&bsns_year=" + year
                + "&reprt_code=11011"; // 사업보고서 (Report Code for Business Report)

        return restTemplate.getForObject(url, Map.class);
    }
}
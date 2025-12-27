/*
package com.example.demo.dvnApiCall.controller;

import com.example.demo.dvnApiCall.service.DomesticDividendService;
import com.example.demo.dvnApiCall.service.OverseasDividendService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dvnApiCall/dividend")
public class DividendController {

    */
/**
     * 국내 배당금 정보를 처리하는 서비스
     *//*

    private final DomesticDividendService domesticService;

    */
/**
     * 해외 배당금 정보를 처리하는 서비스
     *//*

    private final OverseasDividendService overseasService;

    */
/**
     * DividendController의 생성자.
     * DomesticDividendService와 OverseasDividendService를 주입받는다.
     *
     * @param domesticService 국내 배당금 서비스
     * @param overseasService 해외 배당금 서비스
     *//*

    public DividendController(DomesticDividendService domesticService, OverseasDividendService overseasService) {
        this.domesticService = domesticService;
        this.overseasService = overseasService;
    }

    */
/**
     * 해외 배당금 정보를 조회하는 페이지를 반환한다.
     *
     * @return 해외 배당금 조회 페이지의 뷰 이름
     *//*

    @GetMapping("/dividend/overseas")
    public String overseasPage() {
        return "overseasDividend";
    }

    */
/**
     * 해외 배당금 조회 결과를 반환한다.
     *
     * @param symbol 조회할 해외 주식의 심볼
     * @param model 뷰에 데이터를 전달하는 데 사용되는 모델 객체
     * @return 해외 배당금 조회 결과 페이지의 뷰 이름
     *//*

    @GetMapping("/dividend/overseas/result")
    public String overseasResult(@RequestParam String symbol, Model model) {
        Map<String, Object> result = overseasService.getDividend(symbol);
        model.addAttribute("result", result);
        return "overseasDividendResult";
    }

    */
/**
     * 국내 배당금 정보를 조회하는 페이지를 반환한다.
     *
     * @return 국내 배당금 조회 페이지의 뷰 이름
     *//*

    @GetMapping("/dividend/domestic")
    public String domesticPage() {
        return "domesticDividend";
    }

    */
/**
     * 국내 배당금 조회 결과를 반환한다.
     *
     * @param corpCode 조회할 국내 기업의 고유 코드
     * @param year 조회할 연도
     * @param model 뷰에 데이터를 전달하는 데 사용되는 모델 객체
     * @return 국내 배당금 조회 결과 페이지의 뷰 이름
     *//*

    @GetMapping("/dividend/domestic/result")
    public String domesticResult(
            @RequestParam String corpCode,
            @RequestParam String year,
            Model model) {

        Map<String, Object> result = domesticService.getDividend(corpCode, year);
        model.addAttribute("result", result);
        return "domesticDividendResult";
    }
}
*/

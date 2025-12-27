package com.example.demo.dashboard.service.impl;

import com.example.demo.dashboard.mapper.DashboardMapper;
import com.example.demo.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DashboardMapper dashboardMapper;

    /**
     * 대시보드 요약 정보를 조회합니다.
     *
     * @return 요약 정보 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getSummary() {
        try {
            return dashboardMapper.getSummary();
        } catch (Exception e) {
            log.error("Error fetching summary: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve summary data", e);
        }
    }

    /**
     * 월별 데이터를 조회합니다.
     *
     * @return 월별 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getMonthly() {
        try {
            return dashboardMapper.getMonthly();
        } catch (Exception e) {
            log.error("Error fetching monthly data: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve monthly data", e);
        }
    }

    /**
     * 주식 순위 데이터를 조회합니다.
     *
     * @return 주식 순위 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getStockRank() {
        try {
            return dashboardMapper.getStockRank();
        } catch (Exception e) {
            log.error("Error fetching stock rank: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve stock rank data", e);
        }
    }

    /**
     * 은행별 파이 차트 데이터를 조회합니다.
     *
     * @return 은행별 파이 차트 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getBankPie() {
        try {
            return dashboardMapper.getBankPie();
        } catch (Exception e) {
            log.error("Error fetching bank pie data: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve bank pie data", e);
        }
    }

    /**
     * 국가별 파이 차트 데이터를 조회합니다.
     *
     * @return 국가별 파이 차트 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getNationPie() {
        try {
            return dashboardMapper.getNationPie();
        } catch (Exception e) {
            log.error("Error fetching nation pie data: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve nation pie data", e);
        }
    }

    /**
     * 거래 내역 데이터를 조회합니다.
     *
     * @return 거래 내역 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getTransactions() {
        try {
            return dashboardMapper.getTransactions();
        } catch (Exception e) {
            log.error("Error fetching transactions: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve transaction data", e);
        }
    }

    /**
     * 예측 배당금 데이터를 조회합니다.
     *
     * @return 예측 배당금 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getPredictedDividend() {
        try {
            return dashboardMapper.getPredictedDividend();
        } catch (Exception e) {
            log.error("Error fetching predicted dividend: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve predicted dividend data", e);
        }
    }

    /**
     * 추천 주식 데이터를 조회합니다.
     *
     * @return 추천 주식 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getRecommendedStocks() {
        try {
            return dashboardMapper.getRecommendedStocks();
        } catch (Exception e) {
            log.error("Error fetching recommended stocks: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve recommended stocks data", e);
        }
    }

    /**
     * 월별 배당금 추이 데이터를 조회합니다.
     *
     * @return 월별 배당금 추이 데이터 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getMonthlyDividendTrend() {
        try {
            return dashboardMapper.getMonthlyDividendTrend();
        } catch (Exception e) {
            log.error("Error fetching monthly dividend trend: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve monthly dividend trend data", e);
        }
    }
}

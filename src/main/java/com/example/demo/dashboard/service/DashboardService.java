package com.example.demo.dashboard.service;

import java.util.List;
import java.util.Map;

public interface DashboardService {

    List<Map<String, Object>> getSummary();

    List<Map<String, Object>> getMonthly();

    List<Map<String, Object>> getStockRank();

    List<Map<String, Object>> getBankPie();

    List<Map<String, Object>> getNationPie();

    List<Map<String, Object>> getTransactions();

    List<Map<String, Object>> getPredictedDividend();

    List<Map<String, Object>> getRecommendedStocks();

    List<Map<String, Object>> getMonthlyDividendTrend();
}

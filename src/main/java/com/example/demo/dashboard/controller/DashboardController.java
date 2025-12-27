package com.example.demo.dashboard.controller;

import com.example.demo.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 대시보드 뷰를 반환합니다.
     * @return 대시보드 뷰 경로
     */
    @GetMapping(value = {"/", "dashboard"})
    public String dashboard() {
        return "view/dashboard/dashboardView";
    }

    /**
     * 대시보드 요약 정보를 반환합니다.
     * @return 요약 정보 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getSummary(){
        List<Map<String, Object>> list = dashboardService.getSummary();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 월별 데이터를 반환합니다.
     * @return 월별 데이터 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/monthly")
    public ResponseEntity<Map<String, Object>> getMonthly(){
        List<Map<String, Object>> list = dashboardService.getMonthly();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }
    //
    /**
     * 주식 랭킹 데이터를 반환합니다.
     * @return 주식 랭킹 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/stock-rank")
    public ResponseEntity<Map<String, Object>> getStockRank(){
        List<Map<String, Object>> list = dashboardService.getStockRank();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 은행별 파이 차트 데이터를 반환합니다.
     * @return 은행별 파이 차트 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/bank")
    public ResponseEntity<Map<String, Object>> getBankPie(){
        List<Map<String, Object>> list = dashboardService.getBankPie();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 국가별 파이 차트 데이터를 반환합니다.
     * @return 국가별 파이 차트 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/nation")
    public ResponseEntity<Map<String, Object>> getNationPie(){
        List<Map<String, Object>> list = dashboardService.getNationPie();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 거래 내역 데이터를 반환합니다.
     * @return 거래 내역 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/transactions")
    public ResponseEntity<Map<String, Object>> getTransactions(){
        List<Map<String, Object>> list = dashboardService.getTransactions();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 예측 배당금 데이터를 반환합니다.
     * @return 예측 배당금 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/predicted-dividend")
    public ResponseEntity<Map<String, Object>> predictedDividend(){
        List<Map<String, Object>> list = dashboardService.getPredictedDividend();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }


    /**
     * 추천 주식 목록을 반환합니다. (현재는 더미 데이터)
     * @return 추천 주식 목록 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/recommended-stocks")
    public ResponseEntity<Map<String, Object>> recommendedStocks(){
        List<Map<String, Object>> list = dashboardService.getRecommendedStocks();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 월별 배당금 추이 데이터를 반환합니다.
     * @return 월별 배당금 추이 리스트를 포함하는 ResponseEntity
     */
    @GetMapping("/dashboard/dividend-trend")
    public ResponseEntity<Map<String, Object>> getMonthlyDividendTrend(){
        List<Map<String, Object>> list = dashboardService.getMonthlyDividendTrend();
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }
}

package com.example.demo.stockBalance.service.impl;

import com.example.demo.stockBalance.mapper.StockBalanceMapper;
import com.example.demo.stockBalance.service.StockBalanceService;
import com.example.demo.util.pagination.PageResponse;
import com.example.demo.util.pagination.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * stckInfo Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StockBalanceServiceImpl implements StockBalanceService {

    private final StockBalanceMapper stockBalanceMapper;

    /** 모든 주식정보 조회 */
    @Override
    public PageResponse<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
            List<Map<String, Object>> list = stockBalanceMapper.findAll(params);
            int totalCount = stockBalanceMapper.countAll(params);

            return new PageResponse<>(
                    list,
                    (int) params.get("page"),
                    (int) params.get("size"),
                    totalCount
            );
        } catch (Exception e) {
            log.error("주식정보 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }

    /** 특정 주식정보 조회 */
    @Override
    public PageResponse<Map<String, Object>> findById(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
            List<Map<String, Object>> list = stockBalanceMapper.findById(params);
            int totalCount = stockBalanceMapper.countAll(params);

            return new PageResponse<>(
                    list,
                    (int) params.get("page"),
                    (int) params.get("size"),
                    totalCount
            );
        } catch (Exception e) {
            log.error("주식정보 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }

    /** 모든 주식정보 조회 */
    @Override
    public List<Map<String, Object>> getSelectAll(Map<String, Object> params) {
        try {
            return stockBalanceMapper.findAll(params);
        } catch (Exception e) {
            log.error("주식정보 조회 실패", e);
            return List.of();
        }
    }

    /** 주식정보 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            stockBalanceMapper.insert(req);
            return Map.of(
                    "status", "success",
                    "message", "주식정보가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("주식정보 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }

    /** 주식정보 업데이트 */
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req) {
//        req.put("stock_balance_no", id);
        int updated = stockBalanceMapper.update(req);

        if (updated > 0) {
            req.put("status", "success");
            return req;
        } else {
            return Map.of(
                    "status", "fail",
                    "message", "업데이트된 데이터가 없습니다."
            );
        }
    }

    /** 주식정보 삭제 */
    @Override
    public boolean delete(String stckInfo_no) {
        return stockBalanceMapper.delete(stckInfo_no) > 0;
    }

    /** 상세보기 */
    @Override
    public PageResponse<Map<String, Object>> dlls(Map<String, Object> map) {
        try {
            List<Map<String, Object>> list = stockBalanceMapper.dlls(map);

            return new PageResponse<>(
                    list,
                    1,
                    10,
                    0
            );
        } catch (Exception e) {
            log.error("주식정보 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }
}

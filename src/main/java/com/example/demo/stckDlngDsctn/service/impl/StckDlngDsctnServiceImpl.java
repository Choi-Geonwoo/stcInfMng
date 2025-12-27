package com.example.demo.stckDlngDsctn.service.impl;

import com.example.demo.stckDlngDsctn.mapper.StckDlngDsctnMapper;
import com.example.demo.stckDlngDsctn.service.StckDlngDsctnService;
import com.example.demo.util.pagination.PageResponse;
import com.example.demo.util.pagination.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * stckDlngDsctn Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StckDlngDsctnServiceImpl implements StckDlngDsctnService {

    private final StckDlngDsctnMapper stckDlngDsctnMapper;

    /** 모든 주식거래내역 조회 */
    @Override
    public PageResponse<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
            List<Map<String, Object>> list = stckDlngDsctnMapper.findAll(params);
            int totalCount = stckDlngDsctnMapper.countAll(params);
            return new PageResponse<>(
                    list,
                    (int) params.get("page"),
                    (int) params.get("size"),
                    totalCount
            );
        } catch (Exception e) {
            log.error("주식거래내역 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }

    /** 모든 주식거래내역 조회 */
    @Override
    public PageResponse<Map<String, Object>> findById(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
            List<Map<String, Object>> list = stckDlngDsctnMapper.findById(params);
            int totalCount = stckDlngDsctnMapper.countAll(params);
//            return stckDlngDsctnMapper.findById(params);
            return new PageResponse<>(
                    list,
                    (int) params.get("page"),
                    (int) params.get("size"),
                    totalCount
            );
        } catch (Exception e) {
            log.error("주식거래내역 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }

    /** 모든 주식거래내역 조회 */
    @Override
    public List<Map<String, Object>> getSelectAll(Map<String, Object> params) {
        try {
            return stckDlngDsctnMapper.getSelectAll(params);
        } catch (Exception e) {
            log.error("주식거래내역 조회 실패", e);
            return List.of();
        }
    }

    /** 주식거래내역 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            stckDlngDsctnMapper.insert(req);
            return Map.of(
                    "status", "success",
                    "message", "주식거래내역가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("주식거래내역 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }

    /** 주식거래내역 업데이트 */
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req) {
        req.put("stckDlngDsctn_no", id);
        int updated = stckDlngDsctnMapper.update(req);

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

    /** 주식거래내역 삭제 */
    @Override
    public boolean delete(String id) {
        return stckDlngDsctnMapper.delete(id) > 0;
    }
}

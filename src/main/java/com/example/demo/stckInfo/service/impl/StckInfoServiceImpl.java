package com.example.demo.stckInfo.service.impl;

import com.example.demo.stckInfo.mapper.StckInfoMapper;
import com.example.demo.stckInfo.service.StckInfoService;
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
public class StckInfoServiceImpl implements StckInfoService {

    private final StckInfoMapper stckInfoMapper;

    /** 모든 주식정보 조회 */
    @Override
    public PageResponse<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
            List<Map<String, Object>> list = stckInfoMapper.findAll(params);
            int totalCount = stckInfoMapper.countAll(params);

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
            List<Map<String, Object>> list = stckInfoMapper.findById(params);
            int totalCount = stckInfoMapper.countAll(params);

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
            return stckInfoMapper.findAll(params);
        } catch (Exception e) {
            log.error("주식정보 조회 실패", e);
            return List.of();
        }
    }

    /** 주식정보 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            stckInfoMapper.insert(req);
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
        req.put("stckInfo_no", id);
        int updated = stckInfoMapper.update(req);

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
        return stckInfoMapper.delete(stckInfo_no) > 0;
    }
}

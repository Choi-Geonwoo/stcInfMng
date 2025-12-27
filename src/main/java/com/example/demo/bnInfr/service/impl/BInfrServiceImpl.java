package com.example.demo.bnInfr.service.impl;

import com.example.demo.bnInfr.mapper.BnInfrMapper;
import com.example.demo.bnInfr.service.BnInfrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * bnInfr Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BInfrServiceImpl implements BnInfrService {

    private final BnInfrMapper bnInfrMapper;

    /** 모든 은행정보 조회 */
    @Override
    public List<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            // DB 조회
            return bnInfrMapper.findAll(params);
        } catch (Exception e) {
            log.error("은행정보 조회 실패", e);
            // 예외 시 빈 리스트 반환 또는 필요하면 예외 던지기
            return List.of();
        }
    }


    /** 은행정보 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            bnInfrMapper.insert(req);
            return Map.of(
                    "status", "success",
                    "message", "은행정보가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("은행정보 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }

    /** 은행정보 업데이트 */
    @Override
    public Map<String, Object> update(String bninfr_no, Map<String, Object> req) {
        req.put("bninfr_no", bninfr_no);
        int updated = bnInfrMapper.update(req);

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

    /** 은행정보 삭제 */
    @Override
    public boolean delete(String bninfr_no) {
        return bnInfrMapper.delete(bninfr_no) > 0;
    }
}

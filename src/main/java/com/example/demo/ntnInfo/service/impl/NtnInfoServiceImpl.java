package com.example.demo.ntnInfo.service.impl;

import com.example.demo.ntnInfo.mapper.NtnInfoMapper;
import com.example.demo.ntnInfo.service.NtnInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * ntnInfo Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NtnInfoServiceImpl implements NtnInfoService {

    private final NtnInfoMapper ntnInfoMapper;

    /** 모든 국가정보 조회 */
    @Override
    public List<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            return ntnInfoMapper.findAll(params);
        } catch (Exception e) {
            log.error("국가정보 조회 실패", e);
            return List.of();
        }
    }

    /** 국가정보 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            ntnInfoMapper.insert(req);
            return Map.of(
                    "status", "success",
                    "message", "국가정보가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("국가정보 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }

    /** 국가정보 업데이트 */
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req) {
        req.put("ntnInfo_no", id);
        int updated = ntnInfoMapper.update(req);

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

    /** 국가정보 삭제 */
    @Override
    public boolean delete(String bnInfr_no) {
        return ntnInfoMapper.delete(bnInfr_no) > 0;
    }
}

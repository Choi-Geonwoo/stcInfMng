package com.example.demo.dlngDsctnClnd.service.impl;

import com.example.demo.dlngDsctnClnd.mapper.DlngDsctnClndMapper;
import com.example.demo.dlngDsctnClnd.service.DlngDsctnClndService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * dlngDsctnClnd Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DlngDsctnClndServiceImpl implements DlngDsctnClndService {

    private final DlngDsctnClndMapper dlngDsctnClndMapper;

    /** 모든 거래내역달력 조회 */
    @Override
    public List<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            return dlngDsctnClndMapper.findAll(params);
        } catch (Exception e) {
            log.error("거래내역달력 조회 실패", e);
            return List.of();
        }
    }

    /** 거래내역달력 생성 */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            dlngDsctnClndMapper.insert(req);
            return Map.of(
                    "status", "success",
                    "message", "거래내역달력가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("거래내역달력 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }

    /** 거래내역달력 업데이트 */
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req) {
        req.put("dlngDsctnClnd_no", id);
        int updated = dlngDsctnClndMapper.update(req);

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

    /** 거래내역달력 삭제 */
    @Override
    public boolean delete(String id) {
        return dlngDsctnClndMapper.delete(id) > 0;
    }
}

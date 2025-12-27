package com.example.demo.alctnDlngDsctn.service;

import com.example.demo.util.pagination.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * alctnDlngDsctn Service 인터페이스
 */
public interface AlctnDlngDsctnService {

    /**
     * 모든 배당거래내역 조회
     */
    List<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 모든 배당거래내역 월 조회
     */
    List<Map<String, Object>> getMonthAll(Map<String, Object> map);

    /**
     * 모든 주간 배당거래내역 월 조회
     */
    PageResponse<Map<String, Object>> getWeeklyAll(Map<String, Object> map);

    /**
     * 특정 배당거래내역 조회
     */
    Map<String, Object> findById(String alctndlngdsctn_no);

    /**
     * 배당거래내역 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 배당거래내역 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map, MultipartFile file);

    /**
     * 배당거래내역 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);
}

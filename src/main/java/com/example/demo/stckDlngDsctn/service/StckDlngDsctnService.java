package com.example.demo.stckDlngDsctn.service;

import com.example.demo.util.pagination.PageResponse;

import java.util.List;
import java.util.Map;

/**
 * stckDlngDsctn Service 인터페이스
 */
public interface StckDlngDsctnService {

    /**
     * 모든 주식거래내역 조회
     */
    PageResponse<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 모든 주식거래내역 특정 조회
     */
    PageResponse<Map<String, Object>> findById(Map<String, Object> map);


    /**
     * 모든 주식거래내역 특정 조회
     */
    List<Map<String, Object>> getSelectAll(Map<String, Object> map);


    /**
     * 주식거래내역 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 주식거래내역 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map);

    /**
     * 주식거래내역 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);
}

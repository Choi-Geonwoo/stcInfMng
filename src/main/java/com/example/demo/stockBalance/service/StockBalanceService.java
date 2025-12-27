package com.example.demo.stockBalance.service;

import com.example.demo.util.pagination.PageResponse;

import java.util.List;
import java.util.Map;

/**
 * stckInfo Service 인터페이스
 */
public interface StockBalanceService {

    /**
     * 모든 주식정보 조회
     */
    PageResponse<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 특정 주식정보 조회
     */
    PageResponse<Map<String, Object>>  findById(Map<String, Object> map);

    /**
     * 드롭다운용 모든 주식정보 조회
     */
    List<Map<String, Object>> getSelectAll(Map<String, Object> map);

    /**
     * 주식정보 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 주식정보 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map);

    /**
     * 주식정보 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);


    /**
     * 특정 상세보기 주식정보 조회
     */
    PageResponse<Map<String, Object>>  dlls(Map<String, Object> map);
}

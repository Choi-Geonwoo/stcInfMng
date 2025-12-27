package com.example.demo.bnInfr.service;

import java.util.List;
import java.util.Map;

/**
 * bnInfr Service 인터페이스
 */
public interface BnInfrService {

    /**
     * 모든 은행정보 조회
     */
    List<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 은행정보 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 은행정보 업데이트
     * @param bninfr_no 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String bninfr_no, Map<String, Object> map);

    /**
     * 은행정보 삭제
     * @param bninfr_no 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String bninfr_no);
}
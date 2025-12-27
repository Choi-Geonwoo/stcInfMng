package com.example.demo.ntnInfo.service;

import java.util.List;
import java.util.Map;

/**
 * ntnInfo Service 인터페이스
 */
public interface NtnInfoService {

    /**
     * 모든 국가정보 조회
     */
    List<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 국가정보 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 국가정보 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map);

    /**
     * 국가정보 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);
}

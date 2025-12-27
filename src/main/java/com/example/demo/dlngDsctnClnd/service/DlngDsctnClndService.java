package com.example.demo.dlngDsctnClnd.service;

import java.util.List;
import java.util.Map;

/**
 * dlngDsctnClnd Service 인터페이스
 */
public interface DlngDsctnClndService {

    /**
     * 모든 거래내역달력 조회
     */
    List<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 거래내역달력 생성
     * @param map 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(Map<String, Object> map);

    /**
     * 거래내역달력 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map);

    /**
     * 거래내역달력 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);
}

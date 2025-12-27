package com.example.demo.stckDlngDsctn.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * stckDlngDsctn Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface StckDlngDsctnMapper {

    /**
     * 모든 주식거래내역을 조회합니다.
     *
     * @param map 검색 조건을 담은 Map 객체 (예: 페이징 정보, 검색 키워드 등)
     * @return 조회된 주식거래내역 목록 (각 거래내역은 Map<String, Object> 형태로 반환)
     */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /**
     * 특정 ID(또는 조건)에 해당하는 주식거래내역을 조회합니다.
     *
     * @param map 조회 조건을 담은 Map 객체 (예: 거래내역 ID)
     * @return 조회된 주식거래내역 목록 (각 거래내역은 Map<String, Object> 형태로 반환)
     */
    List<Map<String, Object>> findById(Map<String, Object> map);

    /**
     * 모든 주식거래내역을 조회합니다. (findAll과 유사한 기능으로 보임, 필요시 통합 고려)
     *
     * @param map 검색 조건을 담은 Map 객체
     * @return 조회된 주식거래내역 목록 (각 거래내역은 Map<String, Object> 형태로 반환)
     */
    List<Map<String, Object>> getSelectAll(Map<String, Object> map);

    /**
     * 검색 조건에 해당하는 주식거래내역의 총 개수를 조회합니다.
     *
     * @param map 검색 조건을 담은 Map 객체
     * @return 조회된 주식거래내역의 총 개수
     */
    int countAll(Map<String, Object> map);

    /**
     * 새로운 주식거래내역을 생성(삽입)합니다.
     * 삽입 후 자동 생성된 ID를 반환할 수 있습니다. (MyBatis 설정에 따라 달라짐)
     *
     * @param map 생성할 주식거래내역 정보를 담은 Map 객체
     * @return 삽입된 레코드 수 (일반적으로 1)
     */
    int insert(Map<String, Object> map);

    /**
     * 기존 주식거래내역 정보를 업데이트합니다.
     *
     * @param map 업데이트할 주식거래내역 정보를 담은 Map 객체 (ID 포함)
     * @return 업데이트된 레코드 수
     */
    int update(Map<String, Object> map);

    /**
     * 특정 주식거래내역을 삭제합니다.
     *
     * @param stckDlngDsctn_no 삭제할 주식거래내역의 고유 번호
     * @return 삭제된 레코드 수
     */
    int delete(String stckDlngDsctn_no);
}

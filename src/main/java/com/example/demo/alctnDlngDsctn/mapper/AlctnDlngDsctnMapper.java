package com.example.demo.alctnDlngDsctn.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * alctnDlngDsctn Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface AlctnDlngDsctnMapper {

    /** 배당거래내역 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 배당거래내역 조회 */
    List<Map<String, Object>> getMonthAll(Map<String, Object> map);

    /** 주간 배당거래내역 조회 */
    List<Map<String, Object>> getWeeklyAll(Map<String, Object> map);

    /** 주간 배당거래내역 조회 */
    int getWeeklyCountAll(Map<String, Object> map);

    /** 특정배당거래내역 조회**/
    Map<String, Object> findById(String alctndlngdsctn_no);

    /** 생성 배당거래내역 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 배당거래내역 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 배당거래내역 */
    int delete(String alctnDlngDsctn_no);

    String alctnDlngDsctnSeq();
}

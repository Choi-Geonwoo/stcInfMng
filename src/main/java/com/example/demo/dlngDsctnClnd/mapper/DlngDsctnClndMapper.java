package com.example.demo.dlngDsctnClnd.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * dlngDsctnClnd Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface DlngDsctnClndMapper {

    /** 거래내역달력 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 생성 거래내역달력 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 거래내역달력 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 거래내역달력 */
    int delete(String dlngDsctnClnd_no);
}

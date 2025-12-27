package com.example.demo.stckInfo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * stckInfo Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface StckInfoMapper {

    /** 주식정보 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 주식정보 건수 */
    int countAll(Map<String, Object> map);

    /** 특정 주식정보 조회 */
    List<Map<String, Object>> findById(Map<String, Object> map);

    /** 생성 주식정보 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 주식정보 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 주식정보 */
    int delete(String stckInfo_no);
}

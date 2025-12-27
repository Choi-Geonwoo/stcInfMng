package com.example.demo.bnInfr.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * bnInfr Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface BnInfrMapper {

    /** 은행정보 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 생성 은행정보 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 은행정보 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 은행정보 */
    int delete(String bninfr_no);
}
package com.example.demo.ntnInfo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * ntnInfo Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface NtnInfoMapper {

    /** 국가정보 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 생성 국가정보 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 국가정보 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 국가정보 */
    int delete(String ntnInfo_no);
}

package com.example.demo.fileInfo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * fileInfo Mapper (MyBatis)
 * - DB 쿼리를 매핑
 */
@Mapper
public interface FileInfoMapper {

    /** 파일정보 조회 */
    List<Map<String, Object>> findAll(Map<String, Object> map);

    /** 생성 파일정보 - insert 후 자동 ID 반환 */
    int insert(Map<String, Object> map);

    /** 정보 파일정보 업데이트 */
    int update(Map<String, Object> map);

    /** 삭제 파일정보 */
    int delete(String alctnDlngDsctn_no);
}

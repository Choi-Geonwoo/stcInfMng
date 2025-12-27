package com.example.demo.common.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommonMapper {


    List<Map<String,Object>> selectColumns(@Param("tableId") String tableId);

    List<Map<String, Object>> getSelectAll(Map<String, Object> param);
}

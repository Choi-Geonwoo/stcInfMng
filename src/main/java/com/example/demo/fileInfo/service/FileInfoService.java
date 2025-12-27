package com.example.demo.fileInfo.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * fileInfo Service 인터페이스
 */
public interface FileInfoService {

    /**
     * 모든 파일정보 조회
     */
    List<Map<String, Object>> getAll(Map<String, Object> map);

    /**
     * 파일정보 생성
     * @param file 요청 데이터
     * @return 생성된 객체 반환
     */
    Map<String, Object> create(MultipartFile file, String alctnDlngDsctn_no);

    /**
     * 파일정보 업데이트
     * @param id 업데이트할 ID
     * @param map 업데이트 데이터
     * @return 업데이트된 객체 반환
     */
    Map<String, Object> update(String id, Map<String, Object> map, MultipartFile file);

    /**
     * 파일정보 삭제
     * @param id 삭제할 ID
     * @return 삭제 성공 여부
     */
    boolean delete(String id);
}

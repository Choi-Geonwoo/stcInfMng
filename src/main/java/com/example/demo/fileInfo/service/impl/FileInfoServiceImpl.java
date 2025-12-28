package com.example.demo.fileInfo.service.impl;

import com.example.demo.fileInfo.mapper.FileInfoMapper;
import com.example.demo.fileInfo.service.FileInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * fileInfo Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileInfoServiceImpl implements FileInfoService {

    private final FileInfoMapper fileInfoMapper;

    /** 모든 파일정보 조회 */
    @Override
    public List<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            return fileInfoMapper.findAll(params);
        } catch (Exception e) {
            log.error("파일정보 조회 실패", e);
            return List.of();
        }
    }

    /** 파일정보 생성 */
    @Override
    public Map<String, Object> create(MultipartFile file, String alctnDlngDsctn_no) {
        try {
            Map<String, Object> fileMap = new HashMap<>();
            fileMap.put("fileName", file.getOriginalFilename());
            fileMap.put("fileType", file.getContentType());
            fileMap.put("fileSize", file.getSize());
            fileMap.put("fileData", file.getBytes()); // BLOB 컬럼에 저장
            fileMap.put("delYn", "N");
            fileMap.put("refTable", "alctnDlngDsctn");
            fileMap.put("alctnDlngDsctn_no", alctnDlngDsctn_no); // 참조 레코드 PK
            fileInfoMapper.insert(fileMap);

            return Map.of(
                    "status", "success",
                    "message", "파일정보가 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("파일정보 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }


    /** 파일정보 업데이트 */
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req, MultipartFile file) {
        try {
            // 파일이 있으면 DB에 저장
            if (file != null && !file.isEmpty()) {
                Map<String, Object> fileMap = new HashMap<>();
                fileMap.put("alctnDlngDsctn_no", id);
                fileMap.put("fileName", file.getOriginalFilename());
                fileMap.put("fileType", file.getContentType());
                fileMap.put("fileSize", file.getSize());
                fileMap.put("fileData", file.getBytes()); // DB BLOB 저장
                fileMap.put("delYn", "N");
                fileMap.put("refTable", "alctnDlngDsctn");

                boolean exists = fileInfoMapper.existsByOwner(id);

                if (exists) {
                    fileInfoMapper.update(fileMap);   // 기존 파일 교체
                } else {
                    fileInfoMapper.insert(fileMap);   // 최초 등록
                }
            }

            // JSON으로 반환할 때는 직렬화 가능한 값만 전달
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("message", "파일/데이터 업데이트 완료");

            return result;
        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", "업데이트 실패: " + e.getMessage()
            );
        }
    }



    /** 파일정보 삭제 */
    @Override
    public boolean delete(String alctnDlngDsctn_no) {
        return fileInfoMapper.delete(alctnDlngDsctn_no) > 0;
    }
}

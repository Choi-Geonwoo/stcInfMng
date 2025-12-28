package com.example.demo.alctnDlngDsctn.service.impl;

import com.example.demo.alctnDlngDsctn.mapper.AlctnDlngDsctnMapper;
import com.example.demo.alctnDlngDsctn.service.AlctnDlngDsctnService;
import com.example.demo.fileInfo.service.FileInfoService;
import com.example.demo.util.pagination.PageResponse;
import com.example.demo.util.pagination.PaginationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * alctnDlngDsctn Service
 * - 비즈니스 로직 처리
 * - Mapper를 통해 DB 접근
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AlctnDlngDsctnServiceImpl implements AlctnDlngDsctnService {

    /**
     * 배당거래내역 관련 데이터베이스 작업을 수행하는 매퍼
     */
    private final AlctnDlngDsctnMapper alctnDlngDsctnMapper;

    private final FileInfoService fileInfoService;

    /**
     * 모든 배당거래내역을 조회합니다.
     * @param params 조회 조건을 담은 Map 객체
     * @return 조회된 배당거래내역 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getAll(Map<String, Object> params) {
        try {
            return alctnDlngDsctnMapper.findAll(params);
        } catch (Exception e) {
            log.error("배당거래내역 조회 실패", e);
            return List.of();
        }
    }

    /**
     * 월간 배당거래내역을 조회합니다.
     * @param params 조회 조건을 담은 Map 객체
     * @return 조회된 배당거래내역 목록 (Map<String, Object> 형태)
     */
    @Override
    public List<Map<String, Object>> getMonthAll(Map<String, Object> params) {
        try {
            return alctnDlngDsctnMapper.getMonthAll(params);
        } catch (Exception e) {
            log.error("배당거래내역 조회 실패", e);
            return List.of();
        }
    }


    /**
     * 주간 배당거래내역을 조회합니다.
     * @param params 조회 조건을 담은 Map 객체
     * @return 조회된 배당거래내역 목록 (Map<String, Object> 형태)
     */
    @Override
    public PageResponse<Map<String, Object>> getWeeklyAll(Map<String, Object> params) {
        try {
            // 공통 페이징 로직 추가
            PaginationUtil.addPaging(params);
//            return alctnDlngDsctnMapper.getWeeklyAll(params);
            List<Map<String, Object>> list = alctnDlngDsctnMapper.getWeeklyAll(params);
            int totalCount = alctnDlngDsctnMapper.getWeeklyCountAll(params);
            return new PageResponse<>(
                    list,
                    (int) params.get("page"),
                    (int) params.get("size"),
                    totalCount
            );
        } catch (Exception e) {
            log.error("배당거래내역 조회 실패", e);
            return new PageResponse<>(List.of(), 1, 10, 0);
        }
    }

    /**
     * 특정 배당 거래내역을 조회합니다.
     */
    @Override
    public Map<String, Object> findById(String alctndlngdsctn_no) {
        try {
            Map<String, Object> data = alctnDlngDsctnMapper.findById(alctndlngdsctn_no);
            if (data == null || data.isEmpty()) {
                log.warn("조회 결과 없음: {}", alctndlngdsctn_no);
                return Map.of("data", null);
            }

//            log.info("조회 결과 > {}", data);

            // java.sql.Blob 처리
            Object fileObj = data.get("FILEINFO");
            if (fileObj instanceof java.sql.Blob blob) {
                byte[] blobBytes = blob.getBytes(1, (int) blob.length());
                if (blobBytes.length > 0) {
                    String base64 = Base64.getEncoder().encodeToString(blobBytes);
                    String mime = (String) data.getOrDefault("FILE_TYPE", "image/jpeg");
                    data.put("FILE_URL", "data:" + mime + ";base64," + base64);
                }
                data.remove("FILEINFO"); // 원본 BLOB 제거
            }

//            log.info("Base64 변환 후 데이터 > {}", data);
            return data;

        } catch (Exception e) {
            log.error("배당거래내역 조회 실패: {}", alctndlngdsctn_no, e);
            return Map.of("data", null);
        }
    }



    /**
     * 배당거래내역을 생성합니다.
     */
    @Override
    public Map<String, Object> create(Map<String, Object> req) {
        try {
            String alctnDlngDsctn_no = alctnDlngDsctnMapper.alctnDlngDsctnSeq();
            req.put("alctnDlngDsctn_no", alctnDlngDsctn_no);

            // 1) 배당거래내역 먼저 저장
            alctnDlngDsctnMapper.insert(req);
//            Long alctnDlngDsctnNo = (Long) req.get("alctnDlngDsctnNo"); // Mapper에서 Key 반환 시 사용

            // 파일 전송 여부
            if(req.containsKey("file")){
                // 2) 파일 저장
                MultipartFile file = (MultipartFile) req.get("file");
                // 파일명 추가
                req.put("fileName", file.getOriginalFilename());

                if (file != null && !file.isEmpty()) {
                    fileInfoService.create(file, alctnDlngDsctn_no);
                }
            }

            return Map.of(
                    "status", "success",
                    "message", "배당거래내역이 등록되었습니다."
            );
        } catch (Exception e) {
            log.error("배당거래내역 등록 실패", e);
            return Map.of(
                    "status", "error",
                    "message", "등록 실패: " + e.getMessage()
            );
        }
    }



    /**
     * 배당거래내역을 업데이트합니다.
     */
    @Transactional
    @Override
    public Map<String, Object> update(String id, Map<String, Object> req, MultipartFile file ) {
        req.put("alctnDlngDsctn_no", id);
        req.put("file", file); // Service에서 처리
        int updated = alctnDlngDsctnMapper.update(req);
        // 파일 전송 여부
            // 2) 파일 저장
            if (file != null && !file.isEmpty()) {
                // 파일명 추가
                req.put("fileName", file.getOriginalFilename());
                fileInfoService.update(id, req, file);

                fileInfoService.create(file, String.valueOf(req.get("alctnDlngDsctn_no")));
            }
        if (updated > 0) {
            req.put("status", "success");
            return req;
        } else {
            return Map.of(
                    "status", "fail",
                    "message", "업데이트된 데이터가 없습니다."
            );
        }
    }

    /**
     * 배당거래내역을 삭제합니다.
     */
    @Override
    public boolean delete(String alctnDlngDsctn_no) {
        fileInfoService.delete(alctnDlngDsctn_no);
        return alctnDlngDsctnMapper.delete(alctnDlngDsctn_no) > 0;
    }
}

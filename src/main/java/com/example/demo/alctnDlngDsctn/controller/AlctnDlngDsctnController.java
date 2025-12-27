package com.example.demo.alctnDlngDsctn.controller;

import com.example.demo.alctnDlngDsctn.service.AlctnDlngDsctnService;
import com.example.demo.util.pagination.PageResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * alctnDlngDsctn API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/alctnDlngDsctn")
public class AlctnDlngDsctnController {

    private final AlctnDlngDsctnService alctnDlngDsctnService;

    public AlctnDlngDsctnController(AlctnDlngDsctnService alctnDlngDsctnService) {
        this.alctnDlngDsctnService = alctnDlngDsctnService;
    }

    /** 모든 배당거래내역 조회 */
    @GetMapping("/")
    public String alctnDlngDsctn() {
        return "view/alctnDlngDsctn/alctnDlngDsctnView";
    }

    /** 모든 배당거래내역 조회 */
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = alctnDlngDsctnService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 모든 배당거래내역 조회 */
    @GetMapping("/getMonthAll")
    public ResponseEntity<Map<String, Object>> getMonthAll(
            @RequestParam(required = false) String stckTea,
            @RequestParam(required = false) String bnCd,
            @RequestParam(required = false) String dlngYmd,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String ntnCd ) {
        Map<String, Object> map = new HashMap<>();
        map.put("stckTea", stckTea);
        map.put("bnCd", bnCd);
        map.put("dlngYmd", dlngYmd);
        map.put("month", month);
        map.put("ntnCd", ntnCd);
        List<Map<String, Object>> list = alctnDlngDsctnService.getMonthAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }


    /** 주간 배당거래내역 조회 */
    @GetMapping("/getWeeklyAll")
    public ResponseEntity<Map<String, Object>> getWeeklyAll(
                                                                @RequestParam(required = false) String stckTea,
                                                                @RequestParam(required = false) String bnCd,
                                                                @RequestParam(required = false) String dlngYmd,
                                                                @RequestParam(required = false) String month,
                                                                @RequestParam(required = false) String ntnCd,
                                                                @RequestParam(defaultValue = "1") int page,
                                                                @RequestParam(defaultValue = "10") int size
                                                        ) {
        Map<String, Object> map = new HashMap<>();
        map.put("stckTea", stckTea);
        map.put("bnCd", bnCd);
        map.put("dlngYmd", dlngYmd);
        map.put("month", month);
        map.put("ntnCd", ntnCd);
        map.put("page", page);
        map.put("size", size);
        PageResponse<Map<String, Object>> list = alctnDlngDsctnService.getWeeklyAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    // 모달창 상세 조회
    @GetMapping("/findById/{alctndlngdsctn_no}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable("alctndlngdsctn_no") String alctndlngdsctn_no) {
        Map<String, Object> map = alctnDlngDsctnService.findById(alctndlngdsctn_no);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", map
                )
        );
    }

    /** 특정 배당거래내역 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String stckTea,
            @RequestParam(required = false) String bnCd,
            @RequestParam(required = false) String dlngYmd,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String ntnCd) {

        Map<String, Object> map = new HashMap<>();
        map.put("stckTea", stckTea);
        map.put("bnCd", bnCd);
        map.put("dlngYmd", dlngYmd);
        map.put("month", month);
        map.put("ntnCd", ntnCd);
        List<Map<String, Object>> result = alctnDlngDsctnService.getAll(map);

        if (result == null || result.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", result
                )
        );
    }

    /** 배당거래내역 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(
            @RequestParam String bnCd,
            @RequestParam String stckTea,
            @RequestParam String dlngYmd,
            @RequestParam String dlngAmt,
            @RequestParam(required = false) String dvdnd,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Map<String, Object> req = new HashMap<>();
        req.put("bnCd", bnCd);
        req.put("stckTea", stckTea);
        req.put("dlngYmd", dlngYmd);
        req.put("dlngAmt", dlngAmt);
        req.put("dvdnd", dvdnd);

        try {
            if (file != null && !file.isEmpty()) {
                req.put("file", file); // Service에서 처리
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "파일 처리 실패"));
        }

        Map<String, Object> response = alctnDlngDsctnService.create(req);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    /** 배당거래내역 업데이트 */
    @PostMapping("/update/{currentId}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable String currentId,
            @RequestParam String bnCd,
            @RequestParam String stckTea,
            @RequestParam String dlngYmd,
            @RequestParam String dlngAmt,
            @RequestParam(required = false) String dvdnd,
            @RequestParam(required = false) MultipartFile file
    ) {
        Map<String, Object> req = new HashMap<>();
        req.put("bnCd", bnCd);
        req.put("stckTea", stckTea);
        req.put("dlngYmd", dlngYmd);
        req.put("dlngAmt", dlngAmt);
        req.put("dvdnd", dvdnd);

        try {
            // Service로 전달할 때 file null 체크
            /*Map<String, Object> updated = alctnDlngDsctnService.update(currentId, req,
                    (file != null && !file.isEmpty()) ? file : null
            );*/
            // 서비스 호출, file null 체크 포함
            Map<String, Object> updated = alctnDlngDsctnService.update(currentId, req, file);

            if ("success".equals(updated.get("status"))) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", updated.getOrDefault("message", "업데이트 완료")
                ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "status", "fail",
                                "message", updated.getOrDefault("message", "업데이트 실패")
                        ));
            }
        } catch (Exception e) {
            log.error("배당거래내역 업데이트 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "서버 오류: " + e.getMessage()
                    ));
        }
    }


    /** 은행정보 삭제 */
    @PostMapping("/delete/{currentId}")
    public ResponseEntity<Void> delete(@PathVariable String currentId) {
        boolean deleted = alctnDlngDsctnService.delete(currentId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
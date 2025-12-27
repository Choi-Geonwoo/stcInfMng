package com.example.demo.bnInfr.controller;

import com.example.demo.bnInfr.service.BnInfrService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * bnInfr API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/bninfr")
public class BnInfrController {

    private final BnInfrService bnInfrService;

    public BnInfrController(BnInfrService bnInfrService) {
        this.bnInfrService = bnInfrService;
    }

    /** 모든 은행정보 조회 */
    @GetMapping("/")
    public String bninfr() {
        return "view/bninfr/bninfrView";
    }

    /** 모든 은행정보 조회 */
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = bnInfrService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 특정 은행정보 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchBanks(
            @RequestParam(required = false) String bnCd,
            @RequestParam(required = false) String bnNm) {

        Map<String, Object> map = new HashMap<>();
        map.put("bnCd", bnCd);
        map.put("bnNm", bnNm);
        List<Map<String, Object>> result = bnInfrService.getAll(map);

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

    /** 은행정보 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> request) {

        Map<String, Object> response = bnInfrService.create(request);

        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    /** 은행정보 업데이트 */
    @PostMapping("/update/{bninfr_no}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String bninfr_no,
                                                      @RequestBody Map<String, Object> map) {
        Map<String, Object> updated = bnInfrService.update(bninfr_no, map);

        if ("success".equals(updated.get("status"))) {
            return ResponseEntity.ok(updated); // 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updated);
        }
    }

    /** 은행정보 삭제 */
    @DeleteMapping("/delete/{bninfr_no}")
    public ResponseEntity<Void> delete(@PathVariable String bninfr_no) {
        boolean deleted = bnInfrService.delete(bninfr_no);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
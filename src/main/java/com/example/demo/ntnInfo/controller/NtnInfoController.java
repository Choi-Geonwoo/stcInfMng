package com.example.demo.ntnInfo.controller;

import com.example.demo.ntnInfo.service.NtnInfoService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ntnInfo API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/ntnInfo")
public class NtnInfoController {

    private final NtnInfoService ntnInfoService;

    public NtnInfoController(NtnInfoService ntnInfoService) {
        this.ntnInfoService = ntnInfoService;
    }

    /** 모든 국가정보 조회 */
    @GetMapping("/")
    public String ntnInfo() {
        return "view/ntnInfo/ntnInfoView";
    }

    /** 모든 국가정보 조회 */
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = ntnInfoService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 특정 국가정보 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String ntnCd,
            @RequestParam(required = false) String ntnNm) {

        Map<String, Object> map = new HashMap<>();
        map.put("ntnCd", ntnCd);
        map.put("ntnNm", ntnNm);
        List<Map<String, Object>> result = ntnInfoService.getAll(map);

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

    /** 국가정보 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = ntnInfoService.create(request);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /** 국가정보 업데이트 */
    @PostMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id,
                                                      @RequestBody Map<String, Object> map) {
        Map<String, Object> updated = ntnInfoService.update(id, map);
        if ("success".equals(updated.get("status"))) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updated);
        }
    }

    /** 국가정보 삭제 */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = ntnInfoService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}

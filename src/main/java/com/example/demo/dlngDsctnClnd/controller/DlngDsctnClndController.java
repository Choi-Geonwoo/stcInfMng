package com.example.demo.dlngDsctnClnd.controller;

import com.example.demo.dlngDsctnClnd.service.DlngDsctnClndService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * dlngDsctnClnd API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/dlngDsctnClnd")
public class DlngDsctnClndController {

    private final DlngDsctnClndService dlngDsctnClndService;

    public DlngDsctnClndController(DlngDsctnClndService dlngDsctnClndService) {
        this.dlngDsctnClndService = dlngDsctnClndService;
    }

    /** 모든 거래내역달력 조회 */
    @GetMapping("/")
    public String dlngDsctnClnd() {
        return "view/dlngDsctnClnd/dlngDsctnClndView";
    }

    /** 모든 거래내역달력 조회 */
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll(

    ) {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = dlngDsctnClndService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 특정 거래내역달력 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String bnCd,
            @RequestParam(required = false) String bnNm) {

        Map<String, Object> map = new HashMap<>();
        map.put("bnCd", bnCd);
        map.put("bnNm", bnNm);
        List<Map<String, Object>> result = dlngDsctnClndService.getAll(map);

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

    /** 거래내역달력 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = dlngDsctnClndService.create(request);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /** 거래내역달력 업데이트 */
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id,
                                                      @RequestBody Map<String, Object> map) {
        Map<String, Object> updated = dlngDsctnClndService.update(id, map);
        if ("success".equals(updated.get("status"))) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updated);
        }
    }

    /** 거래내역달력 삭제 */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = dlngDsctnClndService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}

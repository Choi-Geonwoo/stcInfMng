package com.example.demo.stckDlngDsctn.controller;

import com.example.demo.stckDlngDsctn.service.StckDlngDsctnService;
import com.example.demo.util.excel.ExcelMapDownloadUtil;
import com.example.demo.util.excel.ExcelTableRequest;
import com.example.demo.util.pagination.PageResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * stckDlngDsctn API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/stckDlngDsctn")
public class StckDlngDsctnController {

    private final StckDlngDsctnService stckDlngDsctnService;

    public StckDlngDsctnController(StckDlngDsctnService stckDlngDsctnService) {
        this.stckDlngDsctnService = stckDlngDsctnService;
    }

    /**
     * 주식거래내역 페이지를 반환합니다.
     * 이 메서드는 GET 요청을 처리하여 "view/stckDlngDsctn/stckDlngDsctnView" 뷰를 반환합니다.
     *
     * @return 주식거래내역 뷰의 경로
     */
    @GetMapping("/")
    public String stckDlngDsctn() {
        return "view/stckDlngDsctn/stckDlngDsctnView";
    }

    /** 모든 주식거래내역 조회 */
    @GetMapping("/getAll")
    /**
     * 모든 주식거래내역을 페이지네이션하여 조회합니다.
     *
     * @param page 요청된 페이지 번호 (기본값: 1)
     * @param size 페이지당 항목 수 (기본값: 10)
     * @return 조회된 주식거래내역 목록과 페이지 정보를 포함하는 응답 엔티티
     */
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Map<String, Object> map = new HashMap<>();
        map.put("page", page);
        map.put("size", size);
        PageResponse<Map<String, Object>> list = stckDlngDsctnService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 모든 주식거래내역을 선택하여 조회합니다.
     *
     * @return 조회된 주식거래내역 목록을 포함하는 응답 엔티티
     */
    /** 모든 주식거래내역 조회 */
    @GetMapping("/getSelectAll")
    public ResponseEntity<Map<String, Object>> getSelectAll() {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = stckDlngDsctnService.getSelectAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /**
     * 특정 조건에 따라 주식거래내역을 검색합니다.
     *
     * @param start_dlngymd 거래 시작일 (선택 사항)
     * @param end_dlngymd 거래 종료일 (선택 사항)
     * @param bncd 은행 코드 (선택 사항)
     * @param stcktea 주식 티커 (선택 사항)
     * @param clsf 분류 (선택 사항)
     * @param page 요청된 페이지 번호 (기본값: 1)
     * @param size 페이지당 항목 수 (기본값: 10)
     * @return 검색된 주식거래내역 목록과 페이지 정보를 포함하는 응답 엔티티
     */
    /** 특정 주식거래내역 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String start_dlngymd,
            @RequestParam(required = false) String end_dlngymd,
            @RequestParam(required = false) String bncd,
            @RequestParam(required = false) String stcktea,
            @RequestParam(required = false) String clsf,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size    ) {

        Map<String, Object> map = new HashMap<>();
        map.put("start_dlngymd", start_dlngymd);
        map.put("end_dlngymd", end_dlngymd);
        map.put("bnCd", bncd);
        map.put("stckTea", stcktea);
        map.put("page", page);
        map.put("size", size);
        map.put("clsf", clsf);
        PageResponse<Map<String, Object>> result = stckDlngDsctnService.findById(map);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", result
                )
        );
    }

    /**
     * 새로운 주식거래내역을 생성합니다.
     *
     * @param request 생성할 주식거래내역의 데이터를 담고 있는 맵
     * @return 생성 결과와 상태를 포함하는 응답 엔티티 (성공 시 201 Created, 실패 시 400 Bad Request)
     */
    /** 주식거래내역 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = stckDlngDsctnService.create(request);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 특정 ID를 가진 주식거래내역을 업데이트합니다.
     *
     * @param id 업데이트할 주식거래내역의 ID
     * @param map 업데이트할 데이터를 담고 있는 맵
     * @return 업데이트 결과와 상태를 포함하는 응답 엔티티 (성공 시 200 OK, 실패 시 400 Bad Request)
     */
    /** 주식거래내역 업데이트 */
    @PostMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id,
                                                      @RequestBody Map<String, Object> map) {
        Map<String, Object> updated = stckDlngDsctnService.update(id, map);
        if ("success".equals(updated.get("status"))) {
//            return ResponseEntity.notFound().build();
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updated);
        }
    }

    /**
     * 주식거래내역 삭제
     * @param id 삭제할 주식거래내역의 ID
     * @return 삭제 성공 시 204 No Content, 실패 시 404 Not Found
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = stckDlngDsctnService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PostMapping("/excel/bank")
    public void downloadBankExcel(
            @RequestBody ExcelTableRequest request,
            HttpServletResponse response
    ) throws IOException {

        Map<String, Object> map = new HashMap<>();
        map.put("page", 1);
        map.put("size", Integer.MAX_VALUE); // 엑셀은 사실상 전체
        // 예: MyBatis Map 결과
        PageResponse<Map<String, Object>> page =
                stckDlngDsctnService.getAll(map);
        List<Map<String, Object>> data = page.getList(); // ✅ 핵심
        ExcelMapDownloadUtil.download(
                response,
                "bank_trade_list",
                "Bank",
                data,
                request.getColumns()
        );
    }
}

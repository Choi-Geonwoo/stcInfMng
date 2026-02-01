package com.example.demo.stockBalance.controller;

import com.example.demo.ntnInfo.service.NtnInfoService;
import com.example.demo.stockBalance.service.StockBalanceService;
import com.example.demo.util.excel.ExcelMapDownloadUtil;
import com.example.demo.util.excel.ExcelTableRequest;
import com.example.demo.util.pagination.PageResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * stckInfo API Controller
 * - 클라이언트 요청을 받아 서비스 레이어로 전달하고 응답 반환
 */
@Slf4j
@Controller
@RequestMapping("/stockBalance")
public class StockBalanceController {

    private final StockBalanceService stckInfoService;


//    private final NtnInfoService ntnInfoService;

    public StockBalanceController(StockBalanceService stckInfoService, NtnInfoService ntnInfoService) {
        this.stckInfoService = stckInfoService;
//        this.ntnInfoService = ntnInfoService;
    }

    /** 모든 주식정보 조회 */
    @GetMapping("/")
    public String stckInfo(Model model) {
        Map<String, Object> map = new HashMap<>();
        map.put("useYn", "Y");
        map.put("delYn", "N");
        map.put("excel", "N");
//        model.addAttribute("nList", ntnInfoService.getAll(map));
        return "view/stockBalance/stockBalanceView";
    }

    /** 모든 주식정보 조회 */
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size   ) {
        Map<String, Object> map = new HashMap<>();
        map.put("page", page);
        map.put("size", size);
        PageResponse<Map<String, Object>> list = stckInfoService.getAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 드롭다운용 모든 주식정보 조회 */
    @GetMapping("/getSelectAll")
    public ResponseEntity<Map<String, Object>> getSelectAll() {
        Map<String, Object> map = new HashMap<>();
        map.put("page", null);
        map.put("size", null);
        List<Map<String, Object>> list = stckInfoService.getSelectAll(map);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }

    /** 특정 주식정보 조회 */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String ntnCd,
            @RequestParam(required = false) String stckTea,
            @RequestParam(required = false) String stckNm,
            @RequestParam(required = false) String alctn,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size ) {

        Map<String, Object> map = new HashMap<>();
        map.put("ntnCd", ntnCd);
        map.put("stckTea", stckTea);
        map.put("stckNm", stckNm);
        map.put("alctn", alctn);
        map.put("page", page);
        map.put("size", size);
        PageResponse<Map<String, Object>> result = stckInfoService.findById(map);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", result
                )
        );
    }

    /** 주식정보 생성 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = stckInfoService.create(request);
        if ("success".equals(response.get("status"))) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /** 주식정보 업데이트 */
    @PostMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id,
                                                      @RequestBody Map<String, Object> map) {
        Map<String, Object> updated = stckInfoService.update(id, map);
        if ("success".equals(updated.get("status"))) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updated);
        }
    }

    /** 주식정보 삭제 */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = stckInfoService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build(); // 204 No Content
    }


    /** 주식정보 엑셀 다운로드 */
    @PostMapping("/excel")
    public void downloadBankExcel(
            @RequestBody ExcelTableRequest request,
            HttpServletResponse response
    ) throws IOException {

        Map<String, Object> map = new HashMap<>();
        map.put("page", 1);
        map.put("size", Integer.MAX_VALUE); // 엑셀은 사실상 전체
        map.put("excel", "Y");
        // 예: MyBatis Map 결과
        PageResponse<Map<String, Object>> page =
                stckInfoService.getAll(map);
        List<Map<String, Object>> data = page.getList(); // ✅ 핵심
        ExcelMapDownloadUtil.download(
                response,
                "bank_trade_list",
                "Bank",
                data,
                request.getColumns()
        );
    }



    /** 상세보기 **/
    @GetMapping("/dlls/{id}")
    public ResponseEntity<Map<String, Object>> dlls(@PathVariable String id) {

        Map<String, Object> map = new HashMap<>();
        map.put("stckinfo_no", id);
        PageResponse<Map<String, Object>> result = stckInfoService.dlls(map);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", result
                )
        );
    }
}

package com.example.demo.common.controller;


import com.example.demo.common.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/common")
public class CommonContorller {

    private final CommonService commonService;

    public CommonContorller(CommonService commonService) {
        this.commonService = commonService;
    }

    /** 드롭다운용 공통 조회 */
    @GetMapping("/getSelectAll/{tableId}")
    public ResponseEntity<Map<String, Object>> getSelectAll(@PathVariable String tableId) {
        List<Map<String, Object>> list = commonService.getSelectAll(tableId);
        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "data", list
                )
        );
    }
}

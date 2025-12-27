package com.example.demo;

import com.example.demo.report.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@SpringBootTest
@Transactional // 각각의 테스트 메서드에 대해 트랜잭션을 시작하고, 테스트가 종료되면 롤백
class DemoApplicationTests {


    @Autowired
    private ReportService reportService;

	@Test
	void contextLoads() {
        try {

            Map<String, Object> list = reportService.generateReport();
            System.out.println(">>>>>>>>>>>>>>>>>>>>>"+list);
        } catch (Exception e) {
            System.out.println(e.toString());
        }
	}

}

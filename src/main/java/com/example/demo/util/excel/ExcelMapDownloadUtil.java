package com.example.demo.util.excel;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class ExcelMapDownloadUtil {

    public static void download(
            HttpServletResponse response,
            String fileName,
            String sheetName,
            List<Map<String, Object>> data,
            List<ExcelTableRequest.Column> columns
    ) throws IOException {

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(sheetName);

        // 헤더
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.size(); i++) {
            headerRow.createCell(i)
                    .setCellValue(columns.get(i).getHeader());
        }

        // 데이터
        for (int i = 0; i < data.size(); i++) {
            Row row = sheet.createRow(i + 1);
            Map<String, Object> rowData = data.get(i);

            for (int j = 0; j < columns.size(); j++) {
                Object value = rowData.get(columns.get(j).getKey());
                row.createCell(j)
                        .setCellValue(value == null ? "" : value.toString());
            }
        }

        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=" + fileName + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}

package com.example.demo.util.excel;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExcelTableRequest {

    private List<Column> columns;

    @Getter
    @Setter
    public static class Column {
        private String key;
        private String header;
    }
}
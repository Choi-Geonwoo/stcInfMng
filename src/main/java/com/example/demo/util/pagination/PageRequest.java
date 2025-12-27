package com.example.demo.util.pagination;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PageRequest {

    private int page = 1;   // 현재 페이지
    private int size = 10;  // 페이지당 데이터 수

    public int getOffset() {
        return (page - 1) * size;
    }

    public int getLimit() {
        return size;
    }
}
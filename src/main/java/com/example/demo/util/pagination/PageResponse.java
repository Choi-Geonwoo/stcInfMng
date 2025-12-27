package com.example.demo.util.pagination;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {

    private List<T> list;        // 조회 결과
    private int page;            // 현재 페이지
    private int size;            // 페이지 크기
    private int totalCount;      // 전체 데이터 수
    private int totalPages;      // 전체 페이지 수

    public PageResponse(List<T> list, int page, int size, int totalCount) {
        this.list = list;
        this.page = page;
        this.size = size;
        this.totalCount = totalCount;
        this.totalPages = (int) Math.ceil((double) totalCount / size);
    }
}
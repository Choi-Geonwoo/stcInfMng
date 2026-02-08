/* -------------------------------------------------------------------------- */
/*                        🔥 loadPageDataCommon.js                           */
/*                        🔥 공통 페이징 + 검색 + 전체 조회 모듈                  */
/* -------------------------------------------------------------------------- */

import { request } from './fetchUtil.js';
import { isEmpty } from './comUitl.js';

export async function loadPageDataCommon({
    api,
    searchState,
    page = 1,
    size = 10,
    onData = () => {},
    onPaging = () => {},
    onRestoreSearchInputs = () => {}
}) {
    try {
        let url;

        if (searchState.mode === "search") {
            const query = new URLSearchParams({
                ...searchState.params,
                page,
                size
            });
            url = `${api.SEARCH}?${query}`;
        } else {
            url = `${api.GET_ALL}?page=${page}&size=${size}`;
        }

        // ✅ 반드시 필요
        const result = await request(url, "GET");

        if (!result?.data) return;

        // 🔄 검색 input 복원
        onRestoreSearchInputs();

        if (isEmpty(result.data.list)) {
            alert("검색 결과가 없습니다.");
        }

        // 📌 테이블 렌더링
        onData(result.data);

        // 📌 페이징 UI 렌더링
        onPaging(result.data);

    } catch (err) {
        console.error(err);
        alert("목록 조회 실패");
    }
}
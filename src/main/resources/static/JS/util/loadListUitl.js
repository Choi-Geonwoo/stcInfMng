import { request } from "/JS/util/fetchUtil.js";
import { fillSelect } from '/JS/util/selectUitl.js';


/**
 * 공통 리스트 로더
 * @param {string} url - 요청할 API 주소
 * @param {Array<string>} selectIds - 데이터를 채울 select 요소의 id 배열
 * @param {string} valueKey - option value로 사용할 필드명
 * @param {string} textKey - option 표시 텍스트 필드명
 */
export async function loadListCommon(url, selectIds, valueKey, textKey) {
    try {
        const result = await request(url, "GET");
        const list = result.data || [];

        selectIds.forEach(id => {
            fillSelect(id, list, valueKey, textKey);
        });
    } catch (err) {
        console.error(err);
        alert(`${url} 조회 실패`);
    }
}


export async function loadListCommon_n(url) {
    try {
        const result = await request(url, "GET");
        return result.data ?? [];
    } catch (err) {
        console.error(err);
        alert(`${url} 조회 실패`);
        return [];
    }
}
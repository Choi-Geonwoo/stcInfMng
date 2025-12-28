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
//            fillSelect(id, list, valueKey, textKey);
            fillSelect(id, smartSort(list, {key : valueKey}), valueKey, textKey);
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


/**
 * 범용 리스트 정렬기
 * @param {Array} list - 어떤 구조든 OK
 * @param {Object} rule - 정렬 규칙
 */
function smartSort(list, rule = {}) {

  const {
    priority = ['USEYN', 'DELYN'], // 항상 먼저 고려할 필드
    key = null,                    // 메인 정렬 필드
    order = 'asc',                 // asc | desc
    map = {}                       // 필드별 특수 정렬 맵
  } = rule;

  return [...list].sort((a, b) => {

    // 1. 공통 우선 필드 처리 (USEYN, DELYN 등)
    for (const p of priority) {
      if (a[p] !== b[p]) {
        return String(b[p]).localeCompare(String(a[p])); // Y 먼저, N 뒤
      }
    }

    if (!key) return 0;

    let av = a[key];
    let bv = b[key];

    // 2. 특수 맵 정렬 (요일, 코드 등)
    if (map[key]) {
      return map[key][av] - map[key][bv];
    }

    // 3. 숫자형
    if (!isNaN(av) && !isNaN(bv)) {
      return order === 'asc' ? av - bv : bv - av;
    }

    // 4. 문자열
    return order === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}
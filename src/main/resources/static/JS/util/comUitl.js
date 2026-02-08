
/**
 * 재사용 함수 만들기
 * @param {val} value - null 체크
 * @returns {boodle} 공백여부
 */
export function isEmpty(value) {
  return (
        value == null ||               // null 또는 undefined
        value === '' ||               // 빈 문자열
        (Array.isArray(value) && value.length === 0)  // 빈 배열
      );
}

/* -------------------------------------------------------------------------- */
/*                              Input 헬퍼 함수                                 */
/* -------------------------------------------------------------------------- */
export function getVal(id) {
    return document.getElementById(id)?.value || "";
}

export function getQueryVal(id) {
    return document.getElementById(id)?.value?.trim() || "";
}

export function clearTable() {
    document.getElementById(DOM_ID.TABLE_BODY).innerHTML = "";
}


/* -------------------------------------------------------------------------- */
/**
 * 여러 ID를 입력받아 값을 체크하고 반환
 * @param {Array} ids - HTML ID 배열
 * @returns {Object|null} - 모든 값이 있으면 데이터 객체, 하나라도 비었으면 null
 */
/* -------------------------------------------------------------------------- */
/**
 * ID 배열을 받아 필수 입력값을 체크하는 공통 함수
 * @param {Array} ids - 검사할 엘리먼트 ID 배열
 * @returns {Object|null} - 성공 시 데이터 객체, 실패 시 null
 */
const validateInputs = (ids) => {
  const resultData = {};

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue; // 엘리먼트가 없으면 건너뜀

    const value = el.value.trim();
    // data-name 속성값을 가져오고, 없으면 ID를 기본값으로 사용
    const label = el.dataset.name || id;

    // 값 체크
    if (!value) {
      alert(`${label} 항목은 필수 입력입니다.`);
      el.focus();
      return null; // 검증 실패 시 즉시 종료
    }

    // 검증 통과 시 객체에 담기
    resultData[id] = value;
  }

  return resultData;
};
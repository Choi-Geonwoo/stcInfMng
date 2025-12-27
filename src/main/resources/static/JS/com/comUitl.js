
/**
 * 재사용 함수 만들기
 * @param {val} value - null 체크
 * @returns {boodle} 공백여부
 */
function isEmpty(value) {
  return (
        value == null ||               // null 또는 undefined
        value === '' ||               // 빈 문자열
        (Array.isArray(value) && value.length === 0)  // 빈 배열
      );
}

/* -------------------------------------------------------------------------- */
/*                              Input 헬퍼 함수                                 */
/* -------------------------------------------------------------------------- */
function getVal(id) {
    return document.getElementById(id)?.value || "";
}

function getQueryVal(id) {
    return document.getElementById(id)?.value?.trim() || "";
}

function clearTable() {
    document.getElementById(DOM_ID.TABLE_BODY).innerHTML = "";
}



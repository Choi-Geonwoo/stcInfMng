//import { Util.request } from '/JS/util/fetchUtil.js';
//import { Util.populateTableCommon, Util.initRowHandler, Util.extractRowData } from '/JS/util/TableCommonUitl.js';
import * as Util from '/JS/util/index.js';
// fillSelect는 현재 코드에서 사용되지 않으므로 제거하거나 주석 처리
// import { fillSelect } from '/JS/util/selectUitl.js';

// --- 상수 정의 ---
const API_URL = {
    GET_ALL: '/bninfr/getAll',
    CREATE: '/bninfr/create',
    SEARCH: '/bninfr/search',
    UPDATE_BASE: '/bninfr/update',
    DELETE_BASE: '/bninfr/delete'
};

const DOM_ID = {
    TABLE_BODY: 'bankList',
    SUBMIT_BUTTON: 'submitBtn',
    SEARCH_BUTTON: 'searchBtn',
    INPUT_BNCD: 'bnCd',
    INPUT_BNNM: 'bnNm',
    SELECT_USEYN: 'useYn',
    SELECT_DELYN: 'delYn'
};

const SELECT_OPTIONS = {
    USE_YN: [{value:'Y', label:'사용'}, {value:'N', label:'미사용'}],
    DEL_YN: [{value:'Y', label:'예'}, {value:'N', label:'아니요'}]
};

const MESSAGES = {
    UPDATE_SUCCESS: '수정 완료',
    UPDATE_FAIL: '수정 실패',
    DELETE_CONFIRM: '정말 삭제하시겠습니까?',
    DELETE_SUCCESS: '삭제 완료',
    CREATE_SUCCESS: '등록 성공!',
    CREATE_FAIL_BASE: '등록 실패: ',
    SEARCH_NO_RESULT: '검색 결과가 없습니다.',
    SEARCH_ERROR: '검색 중 오류가 발생했습니다.',
    LOAD_FAIL: '목록 조회 실패'
};

// --- 초기화 함수 ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 목록 조회
    loadBankList();

    // 2. 테이블 행 핸들러 초기화 (수정/삭제)
    initTableHandlers();

    // 3. 이벤트 리스너 등록
    document.getElementById(DOM_ID.SUBMIT_BUTTON).addEventListener('click', handleCreate);
    document.getElementById(DOM_ID.SEARCH_BUTTON).addEventListener('click', handleSearch);
});

// --- 비즈니스 로직 함수 ---

/**
 * 은행 목록을 조회하여 테이블에 렌더링합니다. (전체 리스트)
 */
async function loadBankList() {
    try {
        const result = await Util.request(API_URL.GET_ALL, "GET");
        if (!result || !result.data) return;

        renderTable(result.data);
    } catch (err) {
        console.error(err);
        await Util.AppAlert(MESSAGES.LOAD_FAIL);
    }
}

/**
 * 테이블 행의 수정 및 삭제 이벤트를 초기화합니다.
 */
function initTableHandlers() {
    Util.initRowHandler(DOM_ID.TABLE_BODY, {
        onEdit: async (id, tr) => {
            console.log(id);
            const data = Util.extractRowData(tr);
            console.log(data);
            try {
                await Util.request(`${API_URL.UPDATE_BASE}/${id}`, 'POST', data);
                Util.AppAlert(MESSAGES.UPDATE_SUCCESS);
                window.location.replace(window.location.href);
            } catch (err) {
                Util.AppAlert(MESSAGES.UPDATE_FAIL);
            }
        },
        onDelete: async (id, tr) => {
            if (!confirm(MESSAGES.DELETE_CONFIRM)) return;
            try {
                await Util.request(`${API_URL.DELETE_BASE}/${id}`, 'DELETE');
                tr.remove();
                Util.AppAlert(MESSAGES.DELETE_SUCCESS);
                window.location.replace(window.location.href);
            } catch (err) {
                Util.AppAlert(MESSAGES.UPDATE_FAIL); // 삭제 실패 메시지를 수정 실패로 통일할지, 별도 정의할지 결정
            }
        }
    });
}

/**
 * 새로운 은행 정보를 등록합니다.
 */
async function handleCreate() {
    const bnCd = document.getElementById(DOM_ID.INPUT_BNCD).value.trim();
    const bnNm = document.getElementById(DOM_ID.INPUT_BNNM).value.trim();
    const useYn = document.getElementById(DOM_ID.SELECT_USEYN).value;
    const delYn = document.getElementById(DOM_ID.SELECT_DELYN).value;

    const targetIds = ['bnCd', 'bnNm'];
      // 공통 모듈 호출
    const formDataCheck = validateInputs(targetIds);

    if (!formDataCheck) return;

    const data = { bnCd, bnNm, useYn, delYn };

    try {
        await Util.request(API_URL.CREATE, 'POST', data);
        await Util.AppAlert(MESSAGES.CREATE_SUCCESS);
//        loadBankList(); // 등록 후 리스트 갱신
            window.location.replace(window.location.href);
        // 입력 필드 초기화 로직 추가 고려
    } catch (err) {
        console.error(err);
        await Util.AppAlert(MESSAGES.CREATE_FAIL_BASE + err);
    }
}

/**
 * 검색 조건에 맞는 은행 정보를 조회합니다.
 */
async function handleSearch() {
    // 검색 필드는 ID가 아닌 name으로 접근하고 있으므로 그대로 유지하거나, ID를 부여하여 통일
    const bnCd = document.querySelector('section.search input[name="bnCd"]').value.trim();
    const bnNm = document.querySelector('section.search input[name="bnNm"]').value.trim();

    try {
        const result = await Util.request(`${API_URL.SEARCH}?bnCd=${bnCd}&bnNm=${bnNm}`, 'GET');

        if (!result || !result.data || result.data.length === 0) {
            await Util.AppAlert(MESSAGES.SEARCH_NO_RESULT);
//            document.getElementById(DOM_ID.TABLE_BODY).innerHTML = "";
            window.location.replace(window.location.href);
            return;
        }

        renderTable(result.data);
    } catch (err) {
        console.error(err);
        await Util.AppAlert(MESSAGES.SEARCH_ERROR);
    }
}

/**
 * 데이터를 기반으로 테이블을 렌더링합니다.
 * @param {Array<Object>} data - 테이블에 표시할 데이터 배열
 */
function renderTable(data) {
    Util.populateTableCommon(DOM_ID.TABLE_BODY, data, [
        { key: 'BNINFR_NO', type: 'label', nameTemplate: 'banks[{id}].BNINFR_NO', readOnly: true }, // PK는 읽기 전용으로 설정
        { key: 'BNCD', type: 'text', nameTemplate: 'banks[{id}].BNCD' },
        { key: 'BNNM', type: 'text', nameTemplate: 'banks[{id}].BNNM' },
        { key: 'USEYN', type: 'select',
          nameTemplate: 'banks[{id}].USEYN',
          options: SELECT_OPTIONS.USE_YN },
        { key: 'DELYN', type: 'select',
          nameTemplate: 'banks[{id}].DELYN',
          options: SELECT_OPTIONS.DEL_YN },
        { type: 'button',
          buttons: [
              { action: 'edit', class: 'btn btn-edit', label: '수정' }
              /*,{ action: 'delete', class: 'btn btn-delete', label: '삭제' }*/
          ]
        }
    ], 'BNINFR_NO'); // 고유 ID 필드 지정
}

// 기존의 loadBankList는 이제 renderTable을 호출하도록 변경되었습니다.
// 나머지 주석 처리된 함수 (editBank, deleteBank)는 Util.initRowHandler로 인해 불필요하므로 삭제합니다.
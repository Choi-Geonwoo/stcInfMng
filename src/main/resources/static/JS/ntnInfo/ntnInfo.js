// /JS/pages/ntnInfo.js
/*import { Util.request } from '/JS/util/fetchUtil.js';
import { Util.populateTableCommon, Util.initRowHandler, Util.extractRowData } from '/JS/util/TableCommonUitl.js';*/
import * as Util from '/JS/util/index.js';

const DOM_ID = {
    TABLE_BODY: 'bankList',
    BTN_SUBMIT: 'submitBtn',
    BTN_SEARCH: 'searchBtn',
    INPUT_NTNCD: 'ntnCd',
    INPUT_NTNNM: 'ntnNm',
    SELECT_USEYN: 'useYn',
    SELECT_DELYN: 'delYn'
};

const SELECT_OPTIONS = {
    USE_YN: [{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }],
    DEL_YN: [{ value: 'Y', label: '예' }, { value: 'N', label: '아니요' }]
};

const API_URL = {
    GET_ALL: '/ntnInfo/getAll',
    CREATE: '/ntnInfo/create',
    SEARCH: '/ntnInfo/search',
    UPDATE_BASE: '/ntnInfo/update',
    DELETE_BASE: '/ntnInfo/delete'
};

const MESSAGES = {
    CREATE_SUCCESS: '등록 성공!',
    CREATE_FAIL: '등록 실패: ',
    UPDATE_SUCCESS: '수정 완료',
    UPDATE_FAIL: '수정 실패',
    DELETE_CONFIRM: '정말 삭제하시겠습니까?',
    DELETE_SUCCESS: '삭제 완료',
    DELETE_FAIL: '삭제 실패',
    SEARCH_NO_RESULT: '검색 결과가 없습니다.',
    SEARCH_ERROR: '검색 중 오류가 발생했습니다.',
    LOAD_FAIL: '목록 조회 실패'
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadNtnList();
    initTableHandlers();

    document.getElementById(DOM_ID.BTN_SUBMIT).addEventListener('click', handleCreate);
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener('click', handleSearch);
});

// ------------------------ CRUD ------------------------

async function loadNtnList() {
    try {
        const res = await Util.request(API_URL.GET_ALL, 'GET');
        if (!res || !res.data) return;
        renderTable(res.data , res.data.length);
        console.log(res);
    } catch (err) {
        console.log(err);
        await Util.AppAlert(MESSAGES.LOAD_FAIL);
    }
}

async function handleCreate() {
    const ntncd = document.getElementById(DOM_ID.INPUT_NTNCD).value.trim();
    const ntnnm = document.getElementById(DOM_ID.INPUT_NTNNM).value.trim();
    const useyn = document.getElementById(DOM_ID.SELECT_USEYN).value;
    const delyn = document.getElementById(DOM_ID.SELECT_DELYN).value;

    const data = { ntncd, ntnnm, useyn, delyn };

    try {
        await Util.request(API_URL.CREATE, 'POST', data);
        await Util.AppAlert(MESSAGES.CREATE_SUCCESS);
        loadNtnList();
    } catch (err) {
        console.error(err);
        await Util.AppAlert(MESSAGES.CREATE_FAIL + err);
    }
}

async function handleSearch() {
    const ntnCd = document.querySelector('section.search input[name="ntnCd"]').value.trim();
    const ntnNm = document.querySelector('section.search input[name="ntnNm"]').value.trim();

    try {
        const res = await Util.request(`${API_URL.SEARCH}?ntnCd=${ntnCd}&ntnNm=${ntnNm}`, 'GET');
        if (!res || !res.data || res.data.length === 0) {
            await Util.AppAlert(MESSAGES.SEARCH_NO_RESULT);
            document.getElementById(DOM_ID.TABLE_BODY).innerHTML = '';
            return;
        }
        renderTable(res.data,  res.data.length);
    } catch (err) {
        console.error(err);
        await Util.AppAlert(MESSAGES.SEARCH_ERROR);
    }
}

// ------------------------ 테이블 렌더링 ------------------------

function renderTable(data, totalCount) {
    document.getElementById("countVal").innerHTML = "건수 : "+totalCount;

    Util.populateTableCommon(DOM_ID.TABLE_BODY, data, [
        { key: 'NTNINFO_NO', type: 'label', nameTemplate: 'banks[{id}].NTNINFO_NO', readOnly: true },
        { key: 'NTNCD', type: 'text', nameTemplate: 'banks[{id}].NTNCD' },
        { key: 'NTNNM', type: 'text', nameTemplate: 'banks[{id}].NTNNM' },
        { key: 'USEYN', type: 'select', nameTemplate: 'banks[{id}].USEYN', options: SELECT_OPTIONS.USE_YN },
        { key: 'DELYN', type: 'select', nameTemplate: 'banks[{id}].DELYN', options: SELECT_OPTIONS.DEL_YN },
        {
            type: 'button',
            buttons: [
                          { action: 'edit', class: 'btn btn-edit', label: '수정' }
                          /*,{ action: 'delete', class: 'btn btn-delete', label: '삭제' }*/
                      ]
        }
    ], 'NTNINFO_NO');
}

// ------------------------ 테이블 이벤트 핸들러 ------------------------

function initTableHandlers() {
    Util.initRowHandler(DOM_ID.TABLE_BODY, {
        onEdit: async (id, tr) => {
            const data = Util.extractRowData(tr);
//            console.log(data);
            try {
                await Util.request(`${API_URL.UPDATE_BASE}/${id}`, 'POST', data);
                Util.AppAlert("수정 완료");
            } catch (err) {
                console.log(err);
                Util.AppAlert(MESSAGES.UPDATE_FAIL);
            }
        },
        onDelete: async (id, tr) => {
            if (!confirm(MESSAGES.DELETE_CONFIRM)) return;
            try {
                await Util.request(`${API_URL.DELETE_BASE}/${id}`, 'DELETE');
                tr.remove();
                Util.AppAlert(MESSAGES.DELETE_SUCCESS);
            } catch (err) {
                console.error(err);
                Util.AppAlert(MESSAGES.DELETE_FAIL);
            }
        }
    });
}

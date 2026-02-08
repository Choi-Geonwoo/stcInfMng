/*import { Util.request } from '/JS/util/fetchUtil.js';
import { Util.populateTableCommon, Util.initRowHandler, Util.extractRowData } from '/JS/util/TableCommonUitl.js';
import { Util.renderPagination } from '/JS/util/pagination.js';*/

import * as Util from '/JS/util/index.js';

const DOM_ID = {
    TABLE_BODY: 'bankList',
    BTN_SUBMIT: 'submitBtn',
    BTN_SEARCH: 'searchBtn',
    INPUTS: {
        NTNCD: 'ntnCd',
        STCKTEA: 'stckTea',
        STCKNM: 'stckNm',
        ALCTN: 'alctn',
        USEYN: 'useYn',
        DELYN: 'delYn'
    },
    SEARCH_INPUTS: {
        NTNCD: 's_ntnCd',
        STCKTEA: 's_stckTea',
        STCKNM: 's_stckNm',
        ALCTN: 's_alctn'
    }
};

const SELECT_OPTIONS = {
    USEYN: [{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }],
    DELYN: [{ value: 'Y', label: '예' }, { value: 'N', label: '아니요' }]
};

// 국가정보 초기값 빈 배열로 설정
const SELECT_NTNCD = { NTNCD_V: [] };

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await ntnInfoLoadList(); //국가정보
    await loadList(); // 초기 전체 목록

    document.getElementById(DOM_ID.BTN_SUBMIT).addEventListener('click', onSubmit);
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener('click', onSearch);

    // 버튼 이벤트 위임
    Util.initRowHandler(DOM_ID.TABLE_BODY, {
        onEdit: async (id, tr) => await onEdit(id, tr),
        onDelete: async (id, tr) => await onDelete(id, tr)
    });
}

/* ------------------------------- CRUD ------------------------------- */
async function onSubmit() {
    const data = {
        ntncd: Util.getVal(DOM_ID.INPUTS.NTNCD),
        stcktea: Util.getVal(DOM_ID.INPUTS.STCKTEA),
        stcknm: Util.getVal(DOM_ID.INPUTS.STCKNM),
        alctn: Util.getVal(DOM_ID.INPUTS.ALCTN),
        useyn: Util.getVal(DOM_ID.INPUTS.USEYN),
        delyn: Util.getVal(DOM_ID.INPUTS.DELYN)
    };
    try {
        await Util.request('/stckInfo/create', 'POST', data);
        await Util.AppAlert('등록 성공!');
//        loadList();
        window.location.replace(window.location.href);
    } catch (err) {
        console.error(err);
        await Util.AppAlert('등록 실패: ' + err);
    }
}

async function onSearch() {
    const params = new URLSearchParams({
        ntnCd: Util.getQueryVal(DOM_ID.SEARCH_INPUTS.NTNCD),
        stckTea: Util.getQueryVal(DOM_ID.SEARCH_INPUTS.STCKTEA),
        stckNm: Util.getQueryVal(DOM_ID.SEARCH_INPUTS.STCKNM),
        alctn: Util.getQueryVal(DOM_ID.SEARCH_INPUTS.ALCTN)
    });

    try {
        const result = await Util.request(`/stckInfo/search?${params}`, 'GET');
        if (!result?.data?.length) {
            await Util.AppAlert('검색 결과가 없습니다.');
            clearTable();
            return;
        }
        renderTable(result.data);
    } catch (err) {
        console.error(err);
        await Util.AppAlert('검색 중 오류가 발생했습니다.');
    }
}

/* ------------------------------- 테이블 ------------------------------- */
async function loadList() {
    try {
        const result = await Util.request('/stckInfo/getSelectAll', 'GET');
        if (result?.data) renderTable(result.data);
    } catch (err) {
        console.error(err);
        await Util.AppAlert('목록 조회 실패');
    }
}

/* ------------------------------- 국가정보 ------------------------------- */
async function ntnInfoLoadList() {
    try {
        const result = await Util.request('/ntnInfo/getAll', 'GET');

        if (result?.data && Array.isArray(result.data)) {
            const ntnCdSelect = document.getElementById(DOM_ID.INPUTS.NTNCD);
            const sNtnCdSelect = document.getElementById(DOM_ID.SEARCH_INPUTS.NTNCD);

            // 기존 옵션 초기화
            ntnCdSelect.innerHTML = '';
            sNtnCdSelect.innerHTML = '';

            // SELECT_NTNCD 배열 생성
            const selectNtnCdArr = result.data.map(item => {
                // <select> 옵션 추가
                const option1 = new Option(item.NTNNM, item.NTNCD);
                const option2 = new Option(item.NTNNM, item.NTNCD);
                ntnCdSelect.appendChild(option1);
                sNtnCdSelect.appendChild(option2);

                return { value: item.NTNCD, label: item.NTNNM };
            });

            // 전체 국가 정보 저장 (재할당 없이 속성 추가)
            SELECT_NTNCD.NTNCD_V = selectNtnCdArr;
        }

    } catch (err) {
        console.error(err);
        await Util.AppAlert('국가 조회 실패');
    }
}




function renderTable(data) {
console.log(SELECT_NTNCD.NTNCD_V);
    Util.populateTableCommon(DOM_ID.TABLE_BODY, data, [
        { key: 'STCKINFO_NO', type: 'label', nameTemplate: 'banks[{id}].STCKINFO_NO', readOnly: true, dataField: 'stckinfo_no' },
//        { key: 'NTNNM', type: 'text', nameTemplate: 'banks[{id}].NTNNM', dataField: 'ntnnm' },
        { key: 'NTNCD', type: 'select', nameTemplate: 'banks[{id}].NTNCD', options: SELECT_NTNCD.NTNCD_V, dataField: 'ntncd' },
        { key: 'STCKTEA', type: 'text', nameTemplate: 'banks[{id}].STCKTEA', dataField: 'stcktea' },
        { key: 'STCKNM', type: 'text', nameTemplate: 'banks[{id}].STCKNM', dataField: 'stcknm' },
        { key: 'ALCTN', type: 'text', nameTemplate: 'banks[{id}].ALCTN', dataField: 'alctn' },
        { key: 'USEYN', type: 'select', nameTemplate: 'banks[{id}].USEYN', options: SELECT_OPTIONS.USEYN, dataField: 'useyn' },
        { key: 'DELYN', type: 'select', nameTemplate: 'banks[{id}].DELYN', options: SELECT_OPTIONS.DELYN, dataField: 'delyn' },
        {
            type: 'button',
            buttons: [
                          { action: 'edit', class: 'btn btn-edit', label: '수정' }
                          /*,{ action: 'delete', class: 'btn btn-delete', label: '삭제' }*/
                      ]
        }
    ], 'STCKINFO_NO');
}

/* ------------------------------- 수정/삭제 ------------------------------- */
async function onEdit(id, tr) {
    const data = Util.extractRowData(tr);
    try {
        await Util.request(`/stckInfo/update/${id}`, 'PUT', data);
        await Util.AppAlert('수정 완료');
        window.location.replace(window.location.href);
    } catch (err) {
        console.error(err);
        await Util.AppAlert('수정 실패');
    }
}

async function onDelete(id, tr) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
        await Util.request(`/stckInfo/delete/${id}`, 'DELETE');
        tr.remove();
        await Util.AppAlert('삭제 완료');
        window.location.replace(window.location.href);
    } catch (err) {
        console.error(err);
        await Util.AppAlert('삭제 실패');
    }
}


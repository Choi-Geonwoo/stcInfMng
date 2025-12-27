import { request } from '/JS/util/fetchUtil.js';
import { loadPageDataCommon } from '/JS/util/loadPageDataCommon.js';
import { populateTableCommon, initRowHandler, extractRowData } from '/JS/util/TableCommonUitl.js';
import { loadListCommon, loadListCommon_n } from '/JS/util/loadListUitl.js';
import { renderPagination } from '/JS/util/pagination.js';
import { downloadExcelFromTable } from '/JS/util/excelUtil.js';

const DOM_ID = {
    TABLE_BODY: 'bankList',
    BTN_SUBMIT: 'submitBtn',
    BTN_SEARCH: 'searchBtn',
    BTN_EXCEL: 'excelBtn',
    INPUTS: {
        DLNGYMD: 'dlngYmd',
        BNCD: 'bnCd',
        STCKTEA: 'stckTea',
        DLNGAMT: 'dlngAmt',
        DELYN: 'delYn',
        CLSF: 'clsf',
        BYNGYN: 'byngyn',
        STCKCNT: 'stckcnt'
    },
    SEARCH_INPUTS: {
        DLNGYMD: 's_dlngYmd',
        BNCD: 's_bnCd',
        STCKTEA: 's_stckTea',
        CLSF : 's_clsf'
    }
};

const SELECT_OPTIONS = {
    DEL_YN: [
        { value: 'Y', label: '예' },
        { value: 'N', label: '아니요' }
    ],
    CLSF: [
        { value: '1', label: '연금저축' },
        { value: '2', label: '퇴직연금' },
        { value: '3', label: '일반계좌' }
    ],
    BYNGYN: [
        { value: 'Y', label: '매수' },
        { value: 'N', label: '매도' }
    ]
};

const API_URL = {
    GET_ALL: '/stckDlngDsctn/getAll',
    CREATE: '/stckDlngDsctn/create',
    SEARCH: '/stckDlngDsctn/search',
    UPDATE_BASE: '/stckDlngDsctn/update',
    DELETE_BASE: '/stckDlngDsctn/delete'
};

let BANK_OPTIONS = [];
let STCKNM_OPTIONS = [];

/* -------------------------------------------------------------------------- */
/*                                검색 상태 저장 객체                           */
/* -------------------------------------------------------------------------- */
let SEARCH_STATE = {
    mode: "all", // all | search
    params: {}
};

document.addEventListener("DOMContentLoaded", () => {
    init();

    // pagination 이벤트(ONCLICK 제거)
    document.getElementById("pagination").addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") return;

        const page = Number(e.target.dataset.page);
        if (isNaN(page)) return;

        loadStckDlngDsctn(page);
    });
});

/* -------------------------------------------------------------------------- */
/*                                   초기 로딩                                 */
/* -------------------------------------------------------------------------- */
async function init() {
    await Promise.all([
        loadStckDlngDsctn(),
        loadBankList()
    ]);

    document.getElementById(DOM_ID.BTN_SUBMIT).addEventListener("click", onSubmit);
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener("click", onSearch);
    document.getElementById(DOM_ID.BTN_EXCEL).addEventListener("click", downloadBankExcel);

    initTableHandlers();
}

/* -------------------------------------------------------------------------- */
/*                                   등록(Create)                               */
/* -------------------------------------------------------------------------- */
async function onSubmit() {
    const data = {
        dlngymd: getVal(DOM_ID.INPUTS.DLNGYMD),
        bncd: getVal(DOM_ID.INPUTS.BNCD),
        stcktea: getVal(DOM_ID.INPUTS.STCKTEA),
        dlngamt: getVal(DOM_ID.INPUTS.DLNGAMT),
        delyn: getVal(DOM_ID.INPUTS.DELYN),
        clsf: getVal(DOM_ID.INPUTS.CLSF),
        byngyn: getVal(DOM_ID.INPUTS.BYNGYN),
        stckcnt: getVal(DOM_ID.INPUTS.STCKCNT)
    };

    try {
        await request(API_URL.CREATE, "POST", data);
        alert("등록 성공!");

        // 등록 후 전체 조회 모드로 초기화
        SEARCH_STATE.mode = "all";
        SEARCH_STATE.params = {};

        loadStckDlngDsctn();
    } catch (err) {
        console.error(err);
        alert("등록 실패: " + err);
    }
}

/* -------------------------------------------------------------------------- */
/*                                   검색(Search)                              */
/* -------------------------------------------------------------------------- */
async function onSearch() {
    const params = {
        start_dlngymd: getVal("s_start_dlngYmd"),
        end_dlngymd: getVal("s_end_dlngYmd"),
        bncd: getQueryVal(DOM_ID.SEARCH_INPUTS.BNCD),
        stcktea: getQueryVal(DOM_ID.SEARCH_INPUTS.STCKTEA),
        clsf: getQueryVal(DOM_ID.SEARCH_INPUTS.CLSF),
    };

    // 검색 모드로 전환
    SEARCH_STATE.mode = "search";
    SEARCH_STATE.params = params;

    await loadStckDlngDsctn(1);
}

/* -------------------------------------------------------------------------- */
/*                                 테이블 렌더링                               */
/* -------------------------------------------------------------------------- */
function renderTable(data, totalCount) {
    document.getElementById("countVal").innerHTML = "건수 : "+totalCount;
//    console.log(totalCount);
    populateTableCommon(DOM_ID.TABLE_BODY, data, [

        { key: 'STCKDLNGDSCTN_NO', type: 'label', nameTemplate: 'banks[{id}].STCKDLNGDSCTN_NO', readOnly: true },
        { key: 'DLNGYMD', type: 'date', nameTemplate: 'banks[{id}].DLNGYMD', dataField: 'dlngymd' },
        { key: 'CLSF', type: 'select', nameTemplate: 'banks[{id}].CLSF', options: SELECT_OPTIONS.CLSF, dataField: 'clsf' },
        { key: 'BYNGYN', type: 'select', nameTemplate: 'banks[{id}].BYNGYN', options: SELECT_OPTIONS.BYNGYN, dataField: 'byngyn' },
        { key: 'BNCD', type: 'select', nameTemplate: 'banks[{id}].BNCD',options: BANK_OPTIONS, dataField: 'bncd' },
        { key: 'STCKTEA', type: 'select', nameTemplate: 'banks[{id}].STCKTEA', options: STCKNM_OPTIONS, dataField: 'stcknm' },
        { key: 'STCKCNT', type: 'text', nameTemplate: 'banks[{id}].STCKCNT', dataField: 'stckcnt' },
        { key: 'DLNGAMT', type: 'text', nameTemplate: 'banks[{id}].DLNGAMT', dataField: 'dlngamt' },
        { key: 'DELYN', type: 'select', nameTemplate: 'banks[{id}].DELYN', options: SELECT_OPTIONS.DEL_YN, dataField: 'delyn' },
        {
            type: 'button',
            buttons: [
                { action: 'edit', class: 'btn btn-edit', label: '수정' }
            ]
        }
    ], 'STCKDLNGDSCTN_NO');
}

/* -------------------------------------------------------------------------- */
/*                              수정/삭제 이벤트 핸들러                          */
/* -------------------------------------------------------------------------- */
function initTableHandlers() {
    initRowHandler(DOM_ID.TABLE_BODY, {
        onEdit: async (id, tr) => {
            const data = extractRowData(tr);
//            console.log(data);
            try {
                await request(`${API_URL.UPDATE_BASE}/${id}`, 'POST', data);
                alert("수정 완료");
            } catch (err) {
                console.error(err);
                alert("수정 실패");
            }
        },
        onDelete: async (id, tr) => {
            if (!confirm("정말 삭제하시겠습니까?")) return;

            try {
                await request(`${API_URL.DELETE_BASE}/${id}`, 'POST');
                tr.remove();
                alert("삭제 완료");
            } catch (err) {
                console.error(err);
                alert("삭제 실패");
            }
        }
    });
}

/* -------------------------------------------------------------------------- */
/*                                 Select Box 로드                              */
/* -------------------------------------------------------------------------- */
// 은행목록
async function loadBankList() {
    const stckmn = await loadListCommon_n(
        '/stckInfo/getSelectAll',
        ['stckTea', 's_stckTea'],
        'STCKTEA',
        'STCKNM'
    );
    STCKNM_OPTIONS = stckmn.map(b => ({
        value: b.STCKTEA,
        label: b.STCKNM
    }));

    const banks = await loadListCommon_n(
        '/common/getSelectAll/BNINFR',
        ['bnCd', 's_bnCd'],
        'BNCD',
        'BNNM'
    );

    BANK_OPTIONS = banks.map(b => ({
        value: b.BNCD,
        label: b.BNNM
    }));
//    console.log("BANK_OPTIONS  ", BANK_OPTIONS);
    loadListCommon("/common/getSelectAll/BNINFR", ["bnCd", "s_bnCd"], "BNCD", "BNNM");
//    loadListCommon("/stckInfo/getSelectAll", ["stckTea", "s_stckTea"], "STCKTEA", "STCKNM");
    loadListCommon("/common/getSelectAll/STCKINFO", ["stckTea", "s_stckTea"], "STCKTEA", "STCKNM");
}

/* -------------------------------------------------------------------------- */
/*                🔥 검색/전체 조회 자동 전환 + 페이지 이동 유지                    */
/* -------------------------------------------------------------------------- */
async function loadStckDlngDsctn(page = 1, size = 10) {
    await loadPageDataCommon({
        api: API_URL,
        searchState: SEARCH_STATE,
        page,
        size,
        onData: (data) => renderTable(data.list, data.totalCount),
        onPaging: ({ page, totalPages }) =>
            renderPagination({
                container: "pagination",
                page,
                totalPages,
                onPageChange: (nextPage) =>
                    loadStckDlngDsctn(nextPage, size)
            }),
        onRestoreSearchInputs: restoreSearchInputs
    });
}


/* 검색 input 값 복원 */
function restoreSearchInputs() {
    Object.entries(SEARCH_STATE.params).forEach(([key, value]) => {
        const input = document.getElementById("s_" + key);
        if (input) input.value = value ?? "";
    });
}

/* -------------------------------------------------------------------------- */
/*                               엑셀 다운로드                                  */
/* -------------------------------------------------------------------------- */
function downloadBankExcel() {
    downloadExcelFromTable({
        tableId: 'bankTable',
        url: '/stckDlngDsctn/excel/bank',
        fileName: '주식거래내역_'+getToday("YYYY-MM-DD")
    });
}
import * as Util from '/JS/util/index.js';
// 주식 잔고 관리
/* ============================= DOM ID ============================= */

const DOM_ID = {
    TABLE_BODY: 'bankList',
    TABLE_BODY2: 'dllsList',
    BTN_SEARCH: 'searchBtn',
    BTN_EXCEL: 'excelBtn',
    SEARCH_INPUTS: {
        NTNCD: 's_ntnCd',
        STCKTEA: 's_stckTea',
        ALCTN: 's_alctn'
    }
};

/* ============================= SELECT OPTIONS ============================= */

const SELECT_OPTIONS = {
    DELYN: [
        { value: 'Y', label: '예' },
        { value: 'N', label: '아니요' }
    ]
};

/* ============================= API ============================= */

const API_URL = {
    GET_ALL: '/stockBalance/getAll',
    CREATE: '/stockBalance/create',
    SEARCH: '/stockBalance/search',
    UPDATE_BASE: '/stockBalance/update',
    EXCEL_BASE: '/stockBalance/excel',
};

/* ============================= STATE ============================= */

const SEARCH_STATE = { mode: 'all', params: {} };
let originRowData = null;
let isEditing = false;

/* ============================= 초기화 ============================= */

document.addEventListener('DOMContentLoaded', async () => {
    await loadSelectOptions();
    await loadList();
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener('click', onSearch);
    document.getElementById(DOM_ID.BTN_EXCEL).addEventListener("click", downloadBankExcel);

    document.querySelectorAll('.modal-close-btn, .btn-cancel').forEach(btn =>
        btn.addEventListener('click', closeModal)
    );

});

// 셀렉트 박스 옵션 로드
function loadSelectOptions() {
    Util.loadListCommon("/common/getSelectAll/NTNINFO", ["s_ntnCd"], "NTNCD", "NTNNM");
    Util.loadListCommon("/stckInfo/getSelectAll", ["s_stckTea"], "STCKTEA", "STCKNM");
}

/* ============================= SEARCH ============================= */
// 검색
function onSearch() {
    SEARCH_STATE.mode = 'search';
    SEARCH_STATE.params = {
        ntnCd: val(DOM_ID.SEARCH_INPUTS.NTNCD),
        stckTea: val(DOM_ID.SEARCH_INPUTS.STCKTEA),
        alctn: val(DOM_ID.SEARCH_INPUTS.ALCTN)
    };
    loadList(1);
}

/* ============================= 데이터 로드 ============================= */

async function loadList(page = 1, size = 10) {
    await Util.loadPageDataCommon({
        api: API_URL,
        searchState: SEARCH_STATE,
        page,
        size,
        onData: ({ list }) => renderTable(list, page, size),
        onPaging: ({ page, totalPages }) =>
            Util.renderPagination({
                container: 'pagination',
                page,
                totalPages,
                onPageChange: p => loadList(p, size)
            }),
        onRestoreSearchInputs: restoreSearchInputs
    });
}

/* ============================= 테이블 렌더링 ============================= */

function renderTable(data, page, size) {

    Util.populateTableCommon(DOM_ID.TABLE_BODY, data, [
        { key: '__no', type: 'no' },
        { key: 'STCKINFO_NO', type: 'hidden', dataField: 'stckinfo_no' },
        { key: 'STOCK_BALANCE_NO', type: 'hidden', dataField: 'stock_balance_no' },
        { key: 'NTNNM', type: 'label', dataField: 'ntnnm' },
//        { key: 'STCKNM', type: 'label', dataField: 'stcknm' },
        {
           type: 'button',
           buttons: [{ action: 'dtls', class: 'btn btn-dtls', label: 'STCKNM' }]
        },
        { key: 'ALCTN', type: 'label', dataField: 'alctn' },
        { key: 'QTY', type: 'text', dataField: 'qty' },
        { key: 'DELYN', type: 'select', dataField: 'delyn', options: SELECT_OPTIONS.DELYN },
        {
            type: 'button',
            buttons: row => [
                {   // 등록
                    action: isEmpty(row.STOCK_BALANCE_NO) ? 'add' : 'edit',
                    class:  isEmpty(row.STOCK_BALANCE_NO)  ? 'btn btn-add' : 'btn btn-edit',
                    label:   isEmpty(row.STOCK_BALANCE_NO)  ? '등록' : '수정'
                }
            ]
        }
    ], 'STCKINFO_NO', page, size);

    Util.initRowHandler(DOM_ID.TABLE_BODY, {
        onRowClick: (tr) => originRowData = Util.extractRowData(tr),   // ⭐ 기준 저장
        onAdd: safe(createRow),
        onEdit: safe(updateRow), // 수정
        onDlls: safe(onDlls)    // 상세보기
    });
}
function renderTable2(data, page, size) {
    const list = data.list || [];
    Util.populateTableCommon(DOM_ID.TABLE_BODY2, list, [
        { key: '__no', type: 'no' },
        { key: 'BNNM', type: 'label', dataField: 'bnnm' },       /*은행명*/
        { key: 'DLNGYMD', type: 'label', dataField: 'dlngymd' }, /*거래일자*/
        { key: 'DVDND', type: 'label', dataField: 'dvdnd' },     /*배당금*/
        { key: 'DLNGAMT', type: 'label', dataField: 'dlngamt' } /*거래금액*/
    ], 'STCKINFO_NO', page, size);

    document.getElementById("modalOverlay").style.display = "flex";
    document.body.style.overflow = "hidden";
}
/* ============================= 변경 사항 확인 ============================= */

async function getChanged(tr) {
    const current = Util.extractRowData(tr); // 현재 행 데이터 추출
    if (originRowData && Util.isEqual(originRowData, current)) {
        await Util.AppAlert("변경된 내용이 없습니다.");
        return null;
    }
    return current;
}

/* ============================= 데이터 수정 ============================= */

async function updateRow(id, tr) {
    if (isEditing) return;
    isEditing = true;

    try {
        const changed = await getChanged(tr);
        if (!changed) return;

        await Util.request(`${API_URL.UPDATE_BASE}/${id}`, 'POST', changed);
        await Util.AppAlert("수정 완료");
        originRowData = changed;
    } finally {
        isEditing = false;
    }
}

async function createRow(id, tr) { // 데이터 생성

    const current = Util.extractRowData(tr);

    const changed = await getChanged(tr);
    if (!changed) return;

    if (Number(current.QTY) === 0 && current.DELYN === 'N') {
        await Util.AppAlert("등록할 내용이 없습니다.");
        return;
    }

    await Util.request(API_URL.CREATE, 'POST', current);
    await Util.AppAlert("등록 완료");
    loadList(1);
}


/* ============================= 상세보기 ============================= */
// 상세보기
async  function onDlls(id, tr) {
    try{

        const changed = await getChanged(tr);
        if (!changed) return;

        const res = await Util.request(`/stockBalance/dlls/${id}`, 'GET');
        if (!res || !res.data) return;

        document.getElementById("stcknm").innerHTML = res.data.list[0].STCKNM;
        document.getElementById("ntnnm").innerHTML = res.data.list[0].NTNNM;
        document.getElementById("tot_sun").innerHTML = res.data.list[0].TOT_SUN;
        console.log(res.data.list[0].STCKNM);
        renderTable2(res.data , res.data.length);


    }catch (err) {
        console.error(err);
        await Util.AppAlert("처리 중 오류 발생");
    }
}
/* ============================= 유틸리티 ============================= */

function restoreSearchInputs() {
    Object.entries(SEARCH_STATE.params).forEach(([k, v]) => {
        const el = document.getElementById(`s_${k}`);
        if (el) el.value = v ?? '';
    });
}

const val = id => document.getElementById(id)?.value || '';

const safe = fn => async (...args) => {
    try { await fn(...args); }
    catch (e) {
        console.error(e);
        await Util.AppAlert("처리 중 오류 발생");
    }
};


/* -------------------------------------------------------------------------- */
/*                               엑셀 다운로드                                  */
/* -------------------------------------------------------------------------- */
function downloadBankExcel() {
    Util.downloadExcelFromTable({
        tableId: 'bankTable',
        url: API_URL.EXCEL_BASE,
        fileName: '주식수량정보_'+getToday("YYYY-MM-DD")
    });
}


/**
 * 모달을 닫고 입력 필드를 초기화합니다.
 */
function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
    document.body.style.overflow = "auto";
}

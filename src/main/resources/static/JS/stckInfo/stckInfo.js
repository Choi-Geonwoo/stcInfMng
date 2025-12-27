import { request } from '/JS/util/fetchUtil.js';
import {
    populateTableCommon,
    initRowHandler,
    extractRowData
} from '/JS/util/TableCommonUitl.js';
import { loadPageDataCommon } from '/JS/util/loadPageDataCommon.js';
import { renderPagination } from '/JS/util/pagination.js';
import { loadListCommon_n, loadListCommon  } from '/JS/util/loadListUitl.js';

/* -------------------------------------------------------------------------- */
/*                                   DOM ID                                   */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                                SELECT OPTIONS                               */
/* -------------------------------------------------------------------------- */
const SELECT_OPTIONS = {
    USEYN: [
        { value: 'Y', label: '사용' },
        { value: 'N', label: '미사용' }
    ],
    DELYN: [
        { value: 'Y', label: '예' },
        { value: 'N', label: '아니요' }
    ]
};

let STCKNM_OPTIONS = [];
let NTNCD_OPTIONS = [];
let isSelectReady = false;

/* -------------------------------------------------------------------------- */
/*                                   API URL                                  */
/* -------------------------------------------------------------------------- */
const API_URL = {
    GET_ALL: '/stckInfo/getAll',
    CREATE: '/stckInfo/create',
    SEARCH: '/stckInfo/search',
    UPDATE_BASE: '/stckInfo/update'
};

/* -------------------------------------------------------------------------- */
/*                                SEARCH STATE                                */
/* -------------------------------------------------------------------------- */
const SEARCH_STATE = {
    mode: 'all',
    params: {}
};

/* -------------------------------------------------------------------------- */
/*                               GLOBAL FLAG                                  */
/* -------------------------------------------------------------------------- */
let isEditing = false;

/* -------------------------------------------------------------------------- */
/*                                   INIT                                     */
/* -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initPage();

    document.getElementById('pagination').addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        const page = Number(e.target.dataset.page);
        if (!isNaN(page)) loadStckDlngDsctn(page);
    });
});

async function initPage() {
    await loadSelectOptions();   // ⭐ 반드시 먼저
    await loadStckDlngDsctn();   // ⭐ 그 다음 목록

    document.getElementById(DOM_ID.BTN_SUBMIT).addEventListener('click', onSubmit);
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener('click', onSearch);
}

/*async function init() {
    const [, ] = await Promise.all([
        loadSelectOptions(),
        loadStckDlngDsctn()
    ]);

    // 옵션 로딩 후 다시 테이블 재렌더
    loadStckDlngDsctn();

    document.getElementById(DOM_ID.BTN_SUBMIT).addEventListener('click', onSubmit);
    document.getElementById(DOM_ID.BTN_SEARCH).addEventListener('click', onSearch);
}*/

/* -------------------------------------------------------------------------- */
/*                               SELECT LOAD                                  */
/* -------------------------------------------------------------------------- */
async function loadSelectOptions() {
    const [stckList, ntnList] = await Promise.all([
        loadListCommon_n('/stckInfo/getSelectAll'),
        loadListCommon_n('/ntnInfo/getAll')
    ]);

    STCKNM_OPTIONS = stckList.map(v => ({
        value: v.STCKTEA,
        label: v.STCKNM
    }));

    NTNCD_OPTIONS = ntnList.map(v => ({
        value: v.NTNCD,
        label: v.NTNNM
    }));
    loadListCommon("/ntnInfo/getAll", ["ntnCd", "s_ntnCd"], "NTNCD", "NTNNM");
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */
async function onSubmit() {
    const data = {
        ntncd: getVal(DOM_ID.INPUTS.NTNCD),
        stcktea: getVal(DOM_ID.INPUTS.STCKTEA),
        stcknm: getVal(DOM_ID.INPUTS.STCKNM),
        alctn: getVal(DOM_ID.INPUTS.ALCTN),
        useyn: getVal(DOM_ID.INPUTS.USEYN),
        delyn: getVal(DOM_ID.INPUTS.DELYN)
    };

    try {

        const fields = ["ntncd","stcktea", "stcknm", "alctn"];
        for(const f of fields){
            const val = document.getElementById(f).value;
            if(!val && f !== "dvdnd") return alert("필수 입력값을 확인하세요.");
        }


        await request(API_URL.CREATE, 'POST', data);
        alert('등록 성공');
        loadStckDlngDsctn(1);
    } catch (err) {
        console.error(err);
        alert('등록 실패');
    }
}

/* -------------------------------------------------------------------------- */
/*                                   SEARCH                                   */
/* -------------------------------------------------------------------------- */
function onSearch() {
    SEARCH_STATE.mode = 'search';
    SEARCH_STATE.params = {
        ntnCd: getQueryVal(DOM_ID.SEARCH_INPUTS.NTNCD),
        stckTea: getQueryVal(DOM_ID.SEARCH_INPUTS.STCKTEA),
        stckNm: getQueryVal(DOM_ID.SEARCH_INPUTS.STCKNM),
        alctn: getQueryVal(DOM_ID.SEARCH_INPUTS.ALCTN)
    };

    loadStckDlngDsctn(1);
}

/* -------------------------------------------------------------------------- */
/*                             LOAD + PAGINATION                               */
/* -------------------------------------------------------------------------- */
async function loadStckDlngDsctn(page = 1, size = 10) {
    await loadPageDataCommon({
        api: API_URL,
        searchState: SEARCH_STATE,
        page,
        size,
        onData: ({ list }) => renderTable(list),
        onPaging: ({ page, totalPages }) =>
            renderPagination({
                container: 'pagination',
                page,
                totalPages,
                onPageChange: (p) => loadStckDlngDsctn(p, size)
            }),
        onRestoreSearchInputs: restoreSearchInputs
    });
}

/* -------------------------------------------------------------------------- */
/*                               TABLE HANDLER                                */
/* -------------------------------------------------------------------------- */
function bindTableHandlers() {
    initRowHandler(DOM_ID.TABLE_BODY, {
        onEdit: async (id, tr) => {
            if (isEditing) return;
            isEditing = true;

            try {
                const data = extractRowData(tr);
                await request(`${API_URL.UPDATE_BASE}/${id}`, 'POST', data);
                alert('수정 완료');
            } catch (err) {
                console.error(err);
                alert('수정 실패');
            } finally {
                isEditing = false;
            }
        }
    });
}

/* -------------------------------------------------------------------------- */
/*                               RENDER TABLE                                 */
/* -------------------------------------------------------------------------- */
function renderTable(data) {
    populateTableCommon(
        DOM_ID.TABLE_BODY,
        data,
        [
            { key: 'STCKINFO_NO', type: 'label', readOnly: true, dataField: 'stckinfo_no' },
            { key: 'NTNCD', type: 'select', options: NTNCD_OPTIONS, dataField: 'ntncd' },
            { key: 'STCKTEA', type: 'text', dataField: 'stcktea' },
            { key: 'STCKNM', type: 'text', dataField: 'stcknm' },
            { key: 'ALCTN', type: 'text', dataField: 'alctn' },
            { key: 'USEYN', type: 'select', options: SELECT_OPTIONS.USEYN, dataField: 'useyn' },
            { key: 'DELYN', type: 'select', options: SELECT_OPTIONS.DELYN, dataField: 'delyn' },
            {
                type: 'button',
                buttons: [{ action: 'edit', class: 'btn btn-edit', label: '수정' }]
            }
        ],
        'STCKINFO_NO'
    );

    bindTableHandlers();
}


/* -------------------------------------------------------------------------- */
/*                           SEARCH INPUT RESTORE                              */
/* -------------------------------------------------------------------------- */
function restoreSearchInputs() {
    Object.entries(SEARCH_STATE.params).forEach(([key, value]) => {
        const input = document.getElementById(`s_${key}`);
        if (input) input.value = value ?? '';
    });
}

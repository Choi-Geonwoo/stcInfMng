/*
import { Util.request } from '/JS/util/fetchUtil.js';
import { Util.populateTableCommon } from '/JS/util/TableCommonUitl.js';
import { Util.loadListCommon } from '/JS/util/loadListUitl.js';
import { Util.loadPageDataCommon } from '/JS/util/Util.loadPageDataCommon.js';
import { Util.renderPagination } from '/JS/util/pagination.js';
*/

import * as Util from '/JS/util/index.js';

document.addEventListener('DOMContentLoaded', () => {
    init();
});

// 전역 변수
let bankList = [];
let stockList = [];
let monthList = [];
let currentId = null; // 수정 대상 ID
let chartObj = null;
let lastRawData = null;
let editing = false;   // 🔥 중복 호출 방지 락

const fieldMap = {
    dlngYmd: "DLNGYMD",
    dlngAmt: "DLNGAMT",
    dvdnd: "DVDND"
};

const DOM_ID = {
    TABLE_BODY: 'bankList',
    TABLE_WEEKLY_BODY: 'weeklyList',
}


const API_URL = {
    GET_ALL: '/alctnDlngDsctn/getWeeklyAll',
    SEARCH: '/alctnDlngDsctn/getWeeklyAll',
    EXCEL_BASE: '/alctnDlngDsctn/excel'
};

/**
 * 검색 상태를 저장하는 객체
 */
/* -------------------------------------------------------------------------- */
/*                                검색 상태 저장 객체                           */
/* -------------------------------------------------------------------------- */
let SEARCH_STATE = {
    mode: "all", // all | search
    params: {}
};

/**
 * 초기화 함수: 페이지 로드 시 필요한 모든 초기 설정을 수행합니다.
 */
async function init() {
    initFileInput();
    initDropZone();   // 🔥 이 줄만 추가
    await loadSelectOptions();
//    await Promise.all([loadBankList(), loadStockList()]);
    await loadAlctnDlngDsctn();

    document.getElementById('searchBtn')?.addEventListener('click', searchStockInfo);
    document.getElementById('registerBtn')?.addEventListener('click', openRegisterModal);
    document.getElementById("stckTea")?.addEventListener("change", e => onChangeStock(e.target.value));
    document.getElementById("excelBtn").addEventListener("click", downloadBankExcel);

    document.querySelectorAll('.modal-close-btn, .btn-cancel').forEach(btn =>
        btn.addEventListener('click', closeModal)
    );

    document.querySelectorAll('.btn-save').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();   // submit 완전 차단
            submitModal();
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();   // submit 완전 차단
            editModal();
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();   // submit 완전 차단
            delModal();
        });
    });


    // 탭 클릭 시 차트 재렌더링
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const tabId = this.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.getElementById(tabId).classList.add("active");

            if (tabId === "tab-month" && lastRawData) {
                setTimeout(() => fn_chart(lastRawData), 50);
            }
        });
    });
}

/**
 * 할당 내역 데이터를 로드하고 테이블 및 차트를 렌더링합니다.
 */
async function loadAlctnDlngDsctn() {
    try {
        const result = await Util.request("/alctnDlngDsctn/getAll", "GET");
        populateTable(result?.data || []);

        const result2 = await Util.request("/alctnDlngDsctn/getMonthAll", "GET");
        renderTable(result2?.data || []);
        fn_chart(result2?.data);

        loadStckDlngDsctn(1);
//        const result3 = await Util.request(`/alctnDlngDsctn/getWeeklyAll?page=1&size=10`, "GET");
//        renderTable3(result3.data?.list || []);
    } catch (err) {
        console.error(err);
        alert("목록 조회 실패");
    }
}

/**
 * 드롭다운(select) 옵션을 로드합니다.
 * 국가, 주식, 은행 목록을 비동기적으로 가져와 해당 select 요소에 채웁니다.
 */
async function loadSelectOptions() {
        //Util.loadListCommon("/ntnInfo/getAll", ["s_ntnCd"], "NTNCD", "NTNNM");
        Util.loadListCommon("/common/getSelectAll/NTNINFO", ["s_ntnCd"], "NTNCD", "NTNNM");

        // 주식 목록 직접 로드
        const stockRes = await Util.request("/stckDlngDsctn/getSelectAll", "GET");
        stockList = stockRes?.data || [];
//        console.log("stockList : " , stockList);
        populateSelectOptions("stckTea", stockList, "STCKTEA", "STCKNM");
        populateSelectOptions("s_stckTea", stockList, "STCKTEA", "STCKNM");

        // 🔥 은행 목록 직접 로드
        const bankRes = await Util.request("/bninfr/getAll", "GET");

        bankList = bankRes?.data || [];
        populateSelectOptions("bnCd", bankList, "BNCD", "BNNM");
        populateSelectOptions("s_bnCd", bankList, "BNCD", "BNNM");
}

/**
 * 주어진 select 요소에 옵션을 채웁니다.
 * @param {string} selectId - select 요소의 ID
 * @param {Array} list - 옵션으로 채울 데이터 목록
 * @param {string} valueKey - 옵션의 value로 사용될 데이터 객체의 키
 * @param {string} textKey - 옵션의 텍스트로 사용될 데이터 객체의 키
 */
function populateSelectOptions(selectId, list, valueKey, textKey) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const firstOption = select.options[0] ?? createOption("", "선택");
    select.innerHTML = "";
    select.appendChild(firstOption);
    list.forEach(item => select.appendChild(createOption(item[valueKey], item[textKey])));
}

/**
 * 새로운 option 요소를 생성합니다.
 * @param {string} value - option의 value 속성 값
 * @param {string} text - option의 텍스트 내용
 * @returns {HTMLOptionElement} 생성된 option 요소
 */
function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}
/**
 * 주식 선택 시 해당 주식에 연결된 은행을 자동으로 선택합니다.
 * @param {string} stckTea - 선택된 주식의 종목 코드
 * @returns {void}
 */
// 주식 선택 시 은행 자동 선택
function autoSelectBank(stckTea) {
    const selectedStock = stockList.find(x => x.STCKTEA === stckTea);
    console.log("selectedStock:", selectedStock);
    document.getElementById("bnCd").value = selectedStock?.BNCD || "";
}

/**
 * select 요소의 값을 설정하고, 만약 해당 값이 옵션에 없으면 새로 추가합니다.
 * @param {string} selectId - select 요소의 ID
 * @param {string} value - 설정할 값
 * @param {Array} list - 값을 찾을 데이터 목록
 * @param {string} valKey - 목록에서 값으로 사용될 키
 * @param {string} textKey - 목록에서 텍스트로 사용될 키
 */
// 서버에서 가져온 값이 select에 없으면 추가
function setSelectValue(selectId, value, list, valKey, textKey) {
    if (!value) return;
    const select = document.getElementById(selectId);
    if (!select) return;

    const exists = [...select.options].some(opt => opt.value === value);
    if (!exists) {
        const foundItem = list.find(x => x[valKey] === value);
        const text = foundItem?.[textKey] || value;
        const option = createOption(value, text);
        select.appendChild(option);
    }

    select.value = value; // 값 설정

    // change 이벤트 강제 발생
    select.dispatchEvent(new Event("change"));
}

/**
 * 월별 주식 거래 내역을 그룹화하여 비교 테이블을 렌더링합니다.
 * @param {Array} list - 월별 주식 거래 내역 데이터 목록
 */
/* ----------------------------------------------------------- */
/* 1. 데이터 그룹 구조                                            */
/* ----------------------------------------------------------- */
 function groupByStockYearMonth(list){
     const map = {};
     const yearSet = new Set();

     list.forEach(item=>{
         const name = item.STCKNM;
         const ym = item.DLNG_YM;          // 2024-03
         const year = ym.slice(0,4);
         const month = ym.slice(5,7);

         yearSet.add(year);

         if(!map[name]) map[name] = {};
         if(!map[name][year]) map[name][year] = {};
         if(!map[name][year][month]) map[name][year][month] = [];

         map[name][year][month].push(item);
     });

     return { map, years: [...yearSet].sort() };
 }
/* ----------------------------------------------------------- */
/* 1. 메인 함수                                                  */
/* ----------------------------------------------------------- */
function populateTable(list){
    const { map, years } = groupByStockYearMonth(list);
    const stockNames = Object.keys(map);

    const html = [
        renderHeader(stockNames, years),
        renderBody(map, stockNames, years)
    ].join('');

    const container = document.getElementById("dataList");
    container.innerHTML = html;
    bindDetailEvents(container);
}

/* ----------------------------------------------------------- */
/*2. 데이터 가공 (성능 핵심)                                      */
/* ----------------------------------------------------------- */
function groupByStockAndMonth(list) {
    const result = {};

    list.forEach(item => {
        const name = item.STCKNM;
        const month = item.DLNG_YM?.slice(5, 7);

        if (!result[name]) result[name] = {};
        result[name][month] = item; // 월별 바로 접근 가능
    });

    return result;
}

/* ----------------------------------------------------------- */
/*3. 헤더 렌더링                                                 */
/* ----------------------------------------------------------- */
function renderHeader(stockNames, years){
    let html = `<div class="compare-header"><div class="compare-title">월</div>`;
    stockNames.forEach(name=>{
        years.forEach(year=>{
                html += `<div class="compare-title">${name}<br>${year}</div>`;
        });
    });

    html += `</div>`;
    return html;
}

/* ----------------------------------------------------------- */
/*4. 바디 렌더링                                                 */
/* ----------------------------------------------------------- */
function renderBody(map, stockNames, years){
    let html = '';

    for(let m=1;m<=12;m++){
        const month = String(m).padStart(2,'0');
        html += `<div class="compare-row"><div class="compare-cell">${m}월</div>`;

        stockNames.forEach(name=>{
            years.forEach(year=>{
                const items = map[name]?.[year]?.[month];
                const item = items ? items[items.length-1] : null;

                html += item ? `
                    <div class="compare-cell detail-cell"
                         data-id="${item.ALCTNDLNGDSCTN_NO}">
                        <div class="dlng">${item.DLNG_YM}</div>
                        <div class="dlgamt">${item.DLNGAMT}</div>
                    </div>`
                    : `<div class="compare-cell"></div>`;
            });
        });

        html += `</div>`;
    }
    return html;
}

/* ----------------------------------------------------------- */
/*5. 이벤트 바인딩 (버블링 방식 → 빠르고 안전)                       */
/* ----------------------------------------------------------- */
function bindDetailEvents(container) {
    container.addEventListener('click', e => {
        const cell = e.target.closest('.detail-cell');
        if (cell) showDetailModal(cell.dataset.id);
    });
}

/**
 * 월별 거래 내역 테이블을 렌더링합니다.
 * @param {Array} data - 월별 거래 내역 데이터
 */
function renderTable(data) {
    Util.populateTableCommon(DOM_ID.TABLE_BODY, data, [
        { key: 'DLNGYMD', type: 'label', nameTemplate: 'banks[{id}].DLNGYMD', readOnly: true },
        { key: 'JANUARY', type: 'label', nameTemplate: 'banks[{id}].JANUARY', dataField: 'JANUARY' },
        { key: 'FEBRUARY', type: 'label', nameTemplate: 'banks[{id}].FEBRUARY', dataField: 'FEBRUARY' },
        { key: 'MARCH', type: 'label', nameTemplate: 'banks[{id}].MARCH', dataField: 'MARCH' },
        { key: 'APRIL', type: 'label', nameTemplate: 'banks[{id}].APRIL', dataField: 'APRIL' },
        { key: 'MAY', type: 'label', nameTemplate: 'banks[{id}].MAY', dataField: 'MAY' },
        { key: 'JUNE', type: 'label', nameTemplate: 'banks[{id}].JUNE', dataField: 'JUNE' },
        { key: 'JULY', type: 'label', nameTemplate: 'banks[{id}].JULY', dataField: 'JULY' },
        { key: 'AUGUST', type: 'label', nameTemplate: 'banks[{id}].AUGUST', dataField: 'AUGUST' },
        { key: 'SEPTEMBER', type: 'label', nameTemplate: 'banks[{id}].SEPTEMBER', dataField: 'SEPTEMBER' },
        { key: 'OCTOBER', type: 'label', nameTemplate: 'banks[{id}].OCTOBER', dataField: 'OCTOBER' },
        { key: 'NOVEMBER', type: 'label', nameTemplate: 'banks[{id}].NOVEMBER', dataField: 'NOVEMBER' },
        { key: 'DECEMBER', type: 'label', nameTemplate: 'banks[{id}].DECEMBER', dataField: 'DECEMBER' },
        { key: 'ALL_SUM', type: 'label', nameTemplate: 'banks[{id}].ALL_SUM', dataField: 'ALL_SUM' }
    ], 'DLNGYMD');
}
/**
 * 주간 거래 내역 테이블을 렌더링합니다.
 * @param {Array} data - 주간 거래 내역 데이터
 */
function renderTable3(data) {
    Util.populateTableCommon(DOM_ID.TABLE_WEEKLY_BODY, data, [
        { key: 'DLNGYMD', type: 'label', nameTemplate: 'banks[{id}].DLNGYMD', dataField: 'DLNGYMD', readOnly: true },
        { key: 'NTNNM', type: 'label', nameTemplate: 'banks[{id}].NTNNM' },
        { key: 'STCKNM', type: 'label', nameTemplate: 'banks[{id}].STCKNM', dataField: 'STCKNM' },
        { key: 'DVDND', type: 'label', nameTemplate: 'banks[{id}].DVDND', dataField: 'DVDND' },
        { key: 'DLNGAMT', type: 'label', nameTemplate: 'banks[{id}].DLNGAMT', dataField: 'DLNGAMT' },
    ], 'DLNGYMD');
}

/**
 * 검색 버튼 클릭 시 주식 정보를 검색하고 결과를 테이블과 차트에 렌더링합니다.
 * @returns {Promise<void>}
 */
async function searchStockInfo() {
    const params = new URLSearchParams({
        stckTea: getVal('s_stckTea'),
        bnCd: getVal('s_bnCd'),
        dlngYmd: getVal('s_dlngYmd'),
        month : getVal('s_month'),
        ntnCd : getVal('s_ntnCd')
    });

    const paramsObj = {
            stckTea: getVal('s_stckTea'),
            bnCd: getVal('s_bnCd'),
            dlngYmd: getVal('s_dlngYmd'),
            month : getVal('s_month'),
            ntnCd : getVal('s_ntnCd')
        };

    // 검색 모드로 전환
    SEARCH_STATE.mode = "search";
    SEARCH_STATE.params = paramsObj;

    try {
        const result = await Util.request(`/alctnDlngDsctn/search?${params}`, 'GET');
        if (!result?.data?.length) {
            alert('검색 결과가 없습니다.');
            document.getElementById("bankList").innerHTML = "";
            return;
        }

        const result2 = await Util.request(`/alctnDlngDsctn/getMonthAll?${params}`, "GET");
        renderTable(result2?.data || []);
        fn_chart(result2?.data);
        populateTable(result.data);

        loadStckDlngDsctn(1);
    } catch (err) {
        console.error(err);
        alert('검색 중 오류가 발생했습니다.');
    }
}

/**
 * 등록 모달을 엽니다.
 * 입력 필드를 초기화하고 저장 버튼을 활성화합니다.
 */
function openRegisterModal() {
    openModal();
//    initModalSelect("stckTea", stockList, "STCKTEA", "STCKNM");
//    initModalSelect("bnCd", bankList, "BNCD", "BNNM");
    ["dlngYmd","dlngAmt","dvdnd"].forEach(id => document.getElementById(id).value = "");
    resetFileInput();
}
/**
 * 모달을 열고 버튼 상태를 초기화합니다.
 */

function openModal() {
    document.getElementById("modalOverlay").style.display = "flex";
    document.body.style.overflow = "hidden";

    document.getElementById('btn-edit').classList.add('display_none');
    document.getElementById('btn-delete').classList.add('display_none');
    document.getElementById('btn-save').classList.remove('display_none');
}

/**
 * 모달을 닫고 입력 필드를 초기화합니다.
 */
function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
    document.body.style.overflow = "auto";
    ["dlngYmd","dlngAmt","dvdnd"].forEach(id => document.getElementById(id).value = "");
    ["stckTea","bnCd"].forEach(id => document.getElementById(id).selectedIndex = 0);
    resetFileInput();
}

/**
 * 모달 내의 select 요소를 초기화합니다.
 * @param {string} selectId - select 요소의 ID
 * @param {Array} list - 옵션으로 채울 데이터 목록
 * @param {string} valueKey - 옵션의 value로 사용될 데이터 객체의 키
 * @param {string} textKey - 옵션의 텍스트로 사용될 데이터 객체의 키
 */
// 모달 select 초기화
function initModalSelect(selectId, list, valueKey, textKey) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const firstOption = select.options[0] ?? createOption("", "선택");
    select.innerHTML = "";
    select.appendChild(firstOption);
    list.forEach(item => select.appendChild(createOption(item[valueKey], item[textKey])));
}

/**
 * 특정 ID의 상세 데이터를 불러와 모달에 표시합니다.
 * @param {string} id - 조회할 데이터의 ID
 * @returns {Promise<void>}
 */
async function showDetailModal(id) {
    try {
        const res = await fetch(`/alctnDlngDsctn/findById/${id}`);
        if (!res.ok) throw new Error("상세 데이터를 불러오는데 실패했습니다.");
        const { data } = await res.json();
        currentId = id;

        openModal();

        setSelectValue("stckTea", data.STCKTEA, stockList, "STCKTEA", "STCKNM");
        setSelectValue("bnCd", data.BNCD, bankList, "BNCD", "BNNM");

        autoSelectBank(data.STCKTEA);

        ["dlngYmd","dlngAmt","dvdnd"].forEach(field => {
            const el = document.getElementById(field);
            if(el) el.value = data[fieldMap[field]] || "";
        });

        resetFileInput(data.FILE_URL);

        document.getElementById('btn-save').classList.add('display_none');
        document.getElementById('btn-edit').classList.remove('display_none');
        document.getElementById('btn-delete').classList.remove('display_none');
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

/**
 * 파일 입력 필드를 초기화하고 변경 이벤트를 설정합니다.
 * 파일 선택 시 파일 이름과 이미지 미리보기를 업데이트합니다.
 */
function initFileInput() {
    const realFile = document.getElementById("realFile");
    const fileNameSpan = document.getElementById("fileName");
    const previewImg = document.getElementById("previewImg");

    realFile.addEventListener("change", async () => {
        const file = realFile.files[0];
        if (!file) return;

        fileNameSpan.textContent = file.name;

        // 👉 자동 리사이즈
        const optimized = await resizeImage(file, 1280); // 최대 1280px

        // file input 강제 교체
        replaceFileInput(realFile, optimized);

        previewImg.src = URL.createObjectURL(optimized);
        previewImg.style.display = "block";
    });
}


/**
 * 파일 입력 필드를 초기 상태로 재설정합니다.
 * @param {string} [fileUrl=""] - 미리보기 이미지로 설정할 URL (선택 사항)
 */
function resetFileInput(fileUrl = "") {
    const realFile = document.getElementById("realFile");
    const fileNameSpan = document.getElementById("fileName");
    const previewImg = document.getElementById("previewImg");

    realFile.value = "";
    fileNameSpan.textContent = "선택된 파일이 없습니다.";

    const defaultImg = "/IMG/no.jpg";
    previewImg.src = fileUrl || defaultImg;
    previewImg.style.display = "block";
}

/**
 * 모달의 데이터를 서버에 저장합니다.
 * @returns {void}
 */
function submitModal() {
    const formData = new FormData();
    const fields = ["bnCd","stckTea","dlngYmd","dlngAmt","dvdnd"];
    for(const f of fields){
        const val = document.getElementById(f).value;
        if(!val && f !== "dvdnd") return alert("필수 입력값을 확인하세요.");
        formData.append(f, val);
    }
    const file = document.getElementById("realFile").files[0];
    if(file) formData.append("file", file);


    fetch("/alctnDlngDsctn/create", { method: "POST", body: formData })
        .then(res => res.json())
        .then(resp => { alert(resp.message || "저장 완료"); closeModal(); })
        .catch(err => { console.error(err); alert("저장 실패"); });
}
/**
 * 모달의 데이터를 서버에 업데이트합니다.
 * @returns {void}
}
**/
function editModal(e) {
    if (e) e.preventDefault();

    if (editing) return;   // 이미 실행 중이면 차단
    editing = true;

    if (!currentId) {
        editing = false;
        return alert("수정할 항목을 선택해주세요.");
    }

    const formData = new FormData();
    const fields = ["bnCd","stckTea","dlngYmd","dlngAmt","dvdnd"];

    for (const f of fields) {
        const val = document.getElementById(f).value;
        if (!val && f !== "dvdnd") {
            editing = false;
            return alert("필수 입력값을 확인하세요.");
        }
        formData.append(f, val);
    }

    const file = document.getElementById("realFile").files[0];
    if (file) formData.append("file", file);

    fetch(`/alctnDlngDsctn/update/${currentId}`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(resp => {
        alert(resp.message || "수정 완료");
        closeModal();
    })
    .catch(err => {
        console.error(err);
        alert("수정 실패");
    })
    .finally(() => editing = false);   // 🔓 락 해제
}

/**
 * 현재 선택된 항목을 서버에서 삭제합니다.
 * @returns {void}
}
**/
function delModal() {
    if (!currentId) return alert("삭제할 항목을 선택해주세요.");

    fetch(`/alctnDlngDsctn/delete/${currentId}`, { method: "POST" })
        .then(res => res.json())
        .then(resp => {
            alert(resp.message || "삭제 완료");
            closeModal();
            loadAlctnDlngDsctn(); // 삭제 후 목록 새로고침
        })
        .catch(err => {
            console.error(err);
            alert("삭제 실패");
        });
}

/**
 * 월별 데이터를 기반으로 차트를 렌더링합니다.
 * 한국과 미국 데이터를 구분하여 바 차트와 라인 차트로 표시합니다.
 * @param {Array} rawData - 차트 렌더링에 사용될 원본 데이터
 */
function fn_chart(rawData) {
    lastRawData = rawData; // 마지막 데이터 저장

    const canvas = document.getElementById("monthlyChart");
    if (!canvas) return console.error("monthlyChart canvas not found");

    const tabMonth = document.getElementById("tab-month");
    const style = window.getComputedStyle(tabMonth);
    if (style.display === "none") return;

    if (chartObj) chartObj.destroy();

    const monthKeys = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const monthLabels = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

    const filteredData = rawData.filter(item => item.DLNGYMD !== "합계 (한국)" && item.DLNGYMD !== "합계 (미국)");

    const datasets = filteredData.map(item => ({
        label: item.DLNGYMD,
        data: monthKeys.map(key => item[key]),
        borderWidth: 2,
        fill: false
    }));

chartObj = new Chart(canvas, {
    type: "bar",
    data: {
        labels: monthLabels,
        datasets: filteredData.map(item => ({
            label: item.DLNGYMD,
            data: monthKeys.map(key => item[key]),
            type: item.DLNGYMD.includes("미국") ? 'line' : 'bar',
            yAxisID: item.DLNGYMD.includes("미국") ? 'y1' : 'y',
            borderWidth: 2
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                position: 'left',
                beginAtZero: true
            },
            y1: {
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false }
            }
        }
    }
});
}

/*-------------------------------------------------------------------------- */
/* 주식 거래 내역 데이터를 로드하고 페이지네이션을 처리합니다.                         */
/*                🔥 검색/전체 조회 자동 전환 + 페이지 이동 유지                   */
/* ------------------------------------------------------------------------- */
async function loadStckDlngDsctn(page = 1, size = 10) {
    await Util.loadPageDataCommon({
        api: API_URL,
        searchState: SEARCH_STATE,
        page,
        size,
        onData: ({ list }) => renderTable3(list),
        onPaging: ({ page, totalPages }) =>
            Util.renderPagination({
                container: 'pagination',
                page,
                totalPages,
                onPageChange: (p) => loadStckDlngDsctn(p, size)
            }),
        onRestoreSearchInputs: restoreSearchInputs
    });
}


/**
 * 검색 상태에 저장된 파라미터로 검색 입력 필드를 복원합니다.
 */
function restoreSearchInputs() {
    Object.entries(SEARCH_STATE.params).forEach(([key, value]) => {
        const input = document.getElementById("s_" + key);
        if (input) input.value = value ?? "";
    });
}


/**
 * 주식 선택 변경 시 호출되는 핸들러 함수입니다.
 * 선택된 주식에 연결된 은행을 자동으로 선택합니다.
 * @param {string} stckTea - 선택된 주식의 종목 코드
 */
function onChangeStock(stckTea) {
    if (!stckTea) return;

    const selectedStock = stockList.find(s => s.STCKTEA === stckTea);
    if (!selectedStock) return;

    const mappedBnCd = selectedStock.BNCD;
    const bankSelect = document.getElementById("bnCd");
    const currentBnCd = bankSelect.value;

    // 이미 같은 은행이면 아무 처리 안 함
    if (!currentBnCd || currentBnCd === mappedBnCd) {
        bankSelect.value = mappedBnCd || "";
        return;
    }
    bankSelect.value = mappedBnCd || "";
/*    // 은행이 다를 경우 사용자 확인
    const confirmChange = confirm(
        "선택한 주식의 기본 은행과 현재 선택된 은행이 다릅니다.\n" +
        "기본 은행으로 변경하시겠습니까?"
    );

    if (confirmChange) {
        bankSelect.value = mappedBnCd || "";
    }*/
    // 취소 시 → 기존 은행 유지
}
/***********
2️⃣ 리사이즈 엔진 (JS 하단에 추가)
***********/
function resizeImage(file, maxSize = 1280) {
    return new Promise(resolve => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = e => {
            img.onload = () => {
                let { width, height } = img;

                if (width > height && width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(blob => {
                    resolve(new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    }));
                }, "image/jpeg", 0.85); // JPG로 변환 + 85% 품질
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function replaceFileInput(input, file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
}
/***********
3️⃣ JS 추가 (initFileInput() 아래에 그대로 붙이세요)
***********/
function initDropZone() {
    const dropZone = document.getElementById("dropZone");
    const realFile = document.getElementById("realFile");

    // 클릭 → 파일 선택
    dropZone.addEventListener("click", () => realFile.click());

    ["dragenter", "dragover"].forEach(evt => {
        dropZone.addEventListener(evt, e => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(evt => {
        dropZone.addEventListener(evt, e => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
        });
    });

    dropZone.addEventListener("drop", async e => {
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return alert("이미지만 가능합니다.");

        const optimized = await resizeImage(file, 1280);
        replaceFileInput(realFile, optimized);

        document.getElementById("fileName").textContent = optimized.name;
        document.getElementById("previewImg").src = URL.createObjectURL(optimized);
    });
}

/* -------------------------------------------------------------------------- */
/*                               엑셀 다운로드                                  */
/* -------------------------------------------------------------------------- */
function downloadBankExcel() {
    const params = new URLSearchParams({
        stckTea: getVal('s_stckTea'),
        bnCd: getVal('s_bnCd'),
        dlngYmd: getVal('s_dlngYmd'),
        month : getVal('s_month'),
        ntnCd : getVal('s_ntnCd')
    });

    Util.downloadExcelFromTable({
        tableId: 'listTable',
        url: API_URL.EXCEL_BASE+ `?${params}`,
        fileName: '배당거래내역정보_'+getToday("YYYY-MM-DD")
    });
}
/*
 *1 전력 벽수 및 초기화
 */
let bankList = [];
let stockList = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 데이터 로드 (비동기 체인)
    loadBankList()
        .then(() => loadStockList())
        .then(() => loadAlctnDlngDsctn())
        .catch(err => console.error("초기 로드 실패:", err));

    // 2. 이벤트 리스너 등록
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) searchBtn.addEventListener('click', searchStockInfo);

    // 3. 파일 변경 이벤트 등록
    setupFileInputHandler();
});

/*
* 2. Helper 함수
*/
/**
 * 파일 입력 필드의 변경 이벤트를 설정하고, 파일 이름 표시 및 이미지 미리보기를 처리합니다.
 */
function setupFileInputHandler() {
    const realFile = document.getElementById("realFile");
    const fileNameSpan = document.getElementById("fileName");
    const previewImg = document.getElementById("previewImg");

    if (realFile) {
        realFile.addEventListener("change", () => {
            const file = realFile.files[0];
            fileNameSpan.textContent = file ? file.name : "선택된 파일이 없습니다.";

            if (file && file.type.startsWith("image/")) {
                previewImg.src = URL.createObjectURL(file);
                previewImg.style.display = "block";
            } else {
                previewImg.src = "";
                previewImg.style.display = "none";
            }
        });
    }
}

/**
 * select 요소에 옵션을 채웁니다.
 * @param {string} selectId - select 요소의 ID
 * @param {Array<Object>} list - 데이터 배열
 * @param {string} valueKey - option의 value로 사용할 키
 * @param {string} textKey - option의 text로 사용할 키
 * @param {string} defaultText - 첫 번째 기본 옵션 텍스트
 * @param {string} defaultValue - 첫 번째 기본 옵션 값
 */
function populateSelect(selectId, list, valueKey, textKey, defaultText, defaultValue = "") {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="${defaultValue}">${defaultText}</option>`;
    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item[valueKey];
        option.textContent = item[textKey];
        select.appendChild(option);
    });
}

/*
* 3. 데이터 로드 및 조회 함수
*/
// 전체 목록 조회
async function loadAlctnDlngDsctn() {
    try {
        const result = await request("/alctnDlngDsctn/getAll", "GET");
        if(result?.data) populateTable(result.data);
    } catch (err) {
        console.error("목록 조회 실패:", err);
        alert("목록 조회 실패");
    }
}

// 은행 리스트 로드
async function loadBankList() {
    try {
        const result = await request("/bninfr/getAll", "GET");
        bankList = result.data || [];
        // Helper 함수로 select 채우기
        populateSelect("bnCd", bankList, "BNCD", "BNNM", "은행 선택");
    } catch (err) {
        console.error("은행 목록 조회 실패:", err);
        alert("은행 목록 조회 실패");
        bankList = [];
    }
}

// 주식 리스트 로드
async function loadStockList() {
    try {
        const result = await request("/stckDlngDsctn/getAll", "GET");
        stockList = result.data || [];
        // Helper 함수로 select 채우기
        populateSelect("stckTea", stockList, "STCKTEA", "STCKNM", "주식 선택");

        const select = document.getElementById("stckTea");
        if(select){
            // 선택 시 은행 자동 셋팅 (기존 로직 유지)
            select.addEventListener("change", function() {
                const selectedStock = stockList.find(x => x.STCKTEA === this.value);
                const bankSelect = document.getElementById("bnCd");
                if(selectedStock && selectedStock.BNCD){
                    bankSelect.value = selectedStock.BNCD;
                } else {
                    bankSelect.value = "";
                }
            });
        }
    } catch (err) {
        console.error("주식 목록 조회 실패:", err);
        alert("주식 목록 조회 실패");
        stockList = [];
    }
}

// 검색
async function searchStockInfo() {
    // 변수명 통일을 위해 input의 name을 따름
    const ntnCd = document.querySelector('section.search input[name="NTNCD"]')?.value.trim() || "";
    const ntnNm = document.querySelector('section.search input[name="NTNNM"]')?.value.trim() || "";

    try {
        const result = await request(`/stckInfo/search?ntnCd=${ntnCd}&ntnNm=${ntnNm}`, 'GET');

        if (!result?.data?.length) {
            alert('검색 결과가 없습니다.');
            document.getElementById("dataList").innerHTML = ""; // 검색 결과를 표시하는 곳 초기화
            return;
        }

        alert(`검색 결과 ${result.data.length}건을 불러왔습니다. (테이블 구조상 바로 출력되지 않을 수 있습니다.)`);
        // 주의: populateTable은 월별 비교 데이터 구조에 맞추어져 있으므로,
        // stckInfo/search 결과 (주식 목록)를 그대로 넣으면 UI가 깨질 수 있습니다.
        // populateTable(result.data);

    } catch (err) {
        console.error("검색 중 오류 발생:", err);
        alert('검색 중 오류가 발생했습니다.');
    }
}

/*
 * 4. 테이블 생성, 모달 관련 함수 및 상세 조회
 */

 // 테이블 생성 (유지)
 function populateTable(list) {
     const grouped = {};
     list.forEach(item => {
         if (!grouped[item.STCKNM]) grouped[item.STCKNM] = [];
         grouped[item.STCKNM].push(item);
     });

     const stockNames = Object.keys(grouped);
     let html = '<div class="compare-header"><div class="compare-title">월</div>';
     stockNames.forEach(name => html += `<div class="compare-title">${name}</div>`);
     html += '</div>';

     for (let month = 1; month <= 12; month++) {
         const monthStr = month.toString().padStart(2,'0');
         html += '<div class="compare-row">';
         html += `<div class="compare-cell">${month}월</div>`;
         stockNames.forEach(name => {
             const item = grouped[name].find(x => x.DLNG_YM.slice(5,7) === monthStr);
             if(item){
                 html += `<div class="compare-cell" onclick="showDetailModal('${item.ALCTNDLNGDSCTN_NO}')">
                             <div class="dlng">${item.DLNG_YM}</div>
                             <div class="dvdnd">${item.DVDND}</div>
                          </div>`;
             } else {
                 html += `<div class="compare-cell"></div>`;
             }
         });
         html += '</div>';
     }

     document.getElementById("dataList").innerHTML = html;
 }

 // 모달 열기/닫기 (유지)
 function openModal() {
     document.getElementById("modalOverlay").style.display = "flex";
     document.body.style.overflow = "hidden";
 }
 function closeModal() {
     document.getElementById("modalOverlay").style.display = "none";
     document.body.style.overflow = "auto";
 }

 // 모달 상세 조회 (유지)
 async function showDetailModal(alctndlngdsctn_no) {
     try {
         const response = await fetch(`/alctnDlngDsctn/findById/${alctndlngdsctn_no}`);
         if(!response.ok) throw new Error("상세 데이터를 불러오는데 실패했습니다.");
         const item = await response.json();

         openModal();

         // --- 주식 select 동적 처리 (수정) ---
         const stckSelect = document.getElementById("stckTea");
         const stckName = item.data.STCKNM; // DB에서 가져온 주식 이름 (e.g., 'LG')

         if (stckName) {
             // 1. stockList에서 이름에 해당하는 주식 코드를 찾습니다.
             const stockItem = stockList.find(x => x.STCKNM === stckName);
             // 2. 옵션의 value로 사용할 값 (코드가 있으면 코드, 없으면 이름 자체를 값으로 사용)
             const stckValueToSelect = stockItem ? stockItem.STCKTEA : stckName;

             // 3. select box에 '해당 이름'을 가진 옵션이 이미 있는지 확인합니다. (양쪽 .trim()으로 공백 문제 해결)
             const isOptionPresent = Array.from(stckSelect.options).some(
                 opt => opt.textContent.trim() === stckName.trim()
             );

             if (!isOptionPresent) {
                 // 옵션이 select box에 없는 경우: 새로 생성하고 삽입합니다.
                 const newOption = document.createElement("option");
                 // **수정: value에 코드(STCKTEA) 또는 대체 값을 사용**하여 loadStockList와 일관성을 유지합니다.
                 newOption.value = stckValueToSelect;
                 newOption.textContent = stckName;

                 // stockList의 인덱스 기준으로 정렬하여 삽입 (기존 정렬 로직 유지)
                 const newIndex = stockList.findIndex(x => x.STCKNM === stckName);
                 const currentOptions = Array.from(stckSelect.options).slice(1);

                 let inserted = false;
                 if (newIndex !== -1) {
                     for (let i = 0; i < currentOptions.length; i++) {
                         const currentOptIndex = stockList.findIndex(x => x.STCKNM === currentOptions[i].textContent);

                         if (currentOptIndex !== -1 && newIndex < currentOptIndex) {
                             stckSelect.insertBefore(newOption, currentOptions[i]);
                             inserted = true;
                             break;
                         }
                     }
                 }

                 if (!inserted) {
                     stckSelect.appendChild(newOption);
                 }
             }

             // 4. stckValueToSelect 값(주식 코드)으로 select 하여 인덱스 이동 및 선택을 완료합니다.
             stckSelect.value = stckValueToSelect;
         }

         // --------------------------------------------------------------------------------

         // --- 은행 select 동적 처리 (수정) ---
         const bnSelect = document.getElementById("bnCd");
         const bnValue = item.data.BNCD; // 은행 코드 (e.g., '001')

         if (bnValue) {
             // 은행 옵션이 이미 있는지 확인합니다. (value는 코드를 사용하므로 value로 비교)
             const isOptionPresent = Array.from(bnSelect.options).some(opt => opt.value === bnValue);

             if (!isOptionPresent) {
                 const newOption = document.createElement("option");
                 newOption.value = bnValue;
                 const bankItem = bankList.find(b => b.BNCD === bnValue);
                 newOption.textContent = bankItem ? bankItem.BNNM : bnValue;

                 // bankList의 인덱스를 기준으로 정렬하여 삽입 (기존 정렬 로직 유지)
                 const newIndex = bankList.findIndex(b => b.BNCD === bnValue);
                 const currentOptions = Array.from(bnSelect.options).slice(1);

                 let inserted = false;
                 if (newIndex !== -1) {
                     for (let i = 0; i < currentOptions.length; i++) {
                         const currentOptIndex = bankList.findIndex(b => b.BNCD === currentOptions[i].value);
                         if (currentOptIndex !== -1 && newIndex < currentOptIndex) {
                             bnSelect.insertBefore(newOption, currentOptions[i]);
                             inserted = true;
                             break;
                         }
                     }
                 }
                 if (!inserted) bnSelect.appendChild(newOption);
             }
             // 옵션을 추가했든, 이미 있었든 해당 값(은행 코드)으로 선택
             bnSelect.value = bnValue;
         }

         // --- input 값 채우기 및 파일/이미지 처리 (이하 동일) ---
         document.getElementById("dlngYmd").value = item.data.DLNGYMD || "";
         document.getElementById("dlngAmt").value = item.data.DLNGAMT || "";
         document.getElementById("dvdnd").value = item.data.DVDND || "";

         const realFile = document.getElementById("realFile");
         const fileNameSpan = document.getElementById("fileName");
         const previewImg = document.getElementById("previewImg");

         realFile.value = "";
         fileNameSpan.textContent = "선택된 파일이 없습니다.";
         if(item.data.FILE_URL){
             previewImg.src = item.data.FILE_URL;
             previewImg.style.display = "block";
         } else {
             previewImg.src = "";
             previewImg.style.display = "none";
         }

     } catch (err) {
         console.error("상세 조회 오류:", err);
         alert(err.message);
     }
 }

 // 모달 저장 (유지)
 function submitModal() {
     const bnCd = document.getElementById("bnCd").value;
     const stckTea = document.getElementById("stckTea").value;
     const dlngYmd = document.getElementById("dlngYmd").value;
     const dlngAmt = document.getElementById("dlngAmt").value;
     const dvdnd = document.getElementById("dvdnd").value;
     const file = document.getElementById("realFile").files[0];

     if(!bnCd || !stckTea || !dlngYmd || !dlngAmt) return alert("필수 입력값을 확인하세요.");

     const formData = new FormData();
     formData.append("bnCd", bnCd);
     formData.append("stckTea", stckTea);
     formData.append("dlngYmd", dlngYmd);
     formData.append("dlngAmt", dlngAmt);
     formData.append("dvdnd", dvdnd);
     if(file) formData.append("file", file);

     fetch("/alctnDlngDsctn/create", { method: "POST", body: formData })
         .then(res => res.json())
         .then(resp => {
             alert(resp.message || "저장 완료");
             closeModal();
             loadAlctnDlngDsctn();
         })
         .catch(err => {
             console.error("저장 실패:", err);
             alert("저장 실패");
         });
 }
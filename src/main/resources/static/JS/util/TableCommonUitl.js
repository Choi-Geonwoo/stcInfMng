/**
 * 공통 테이블 생성 함수 (동적 ID 사용)
 * @param {string} tbodyId - 데이터를 채울 tbody ID
 * @param {Array} list - 데이터 배열
 * @param {Array} columns - 컬럼 정의
 * @param {string} idKey - 각 행의 고유 ID 필드 이름
 */
export function populateTableCommon(tbodyId, list, columns, idKey = 'id' , page = 1, size = 10) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const startNo = (page - 1) * size;

    tbody.innerHTML = list.map((item, idx) => {
        const rowId = item[idKey];
        const tds = columns.map(col => {
            if (col.type === 'no') {
               return `<td class="text-center">${startNo + idx + 1}</td>`;
            }
            const value = item[col.key] ?? '';

            switch (col.type) {
                case 'text':
                case 'date':
                    return `<td>
                        <input type="${col.type || 'text'}"
                               value="${value}"
                               name="${col.nameTemplate?.replace('{id}', rowId) || ''}"
                               data-field="${col.key}">
                    </td>`;

                case 'select':
                    return `<td>
                        <select data-field="${col.key}"
                                name="${col.nameTemplate?.replace('{id}', rowId) || ''}">
                            ${col.options?.map(opt => {
                                const isSelected = String(opt.value) === String(value) ? 'selected' : '';
//                                console.log(String(opt.value) + " >>> " + String(value));
                                return `<option value="${opt.value}" ${isSelected}>${opt.label}</option>`;
                            }).join('')}
                        </select>
                    </td>`;

                case 'button':
                    // 1. 버튼 설정 데이터 정규화 (함수형/객체형 대응)
                        const buttonConfigs = typeof col.buttons === 'function'
                            ? col.buttons(item)
                            : col.buttons;

                        // 2. 개별 버튼 HTML 생성 로직 분리
                        const renderButton = (btn) => {
                            // 만약 label이 데이터의 키값이라면 데이터에서 추출, 아니면 고정 텍스트 사용
                            const label = item[btn.label] ?? btn.label;
                            const action = btn.action ?? '';
                            const className = btn.class ?? 'btn';

                            return `
                                <button type="button"
                                        data-action="${action}"
                                        class="${className}">
                                    ${label}
                                </button>`.trim();
                        };

                        // 3. 최종 TD 반환
                        const buttonHtml = (buttonConfigs || [])
                            .map(renderButton)
                            .join('');

                        return `<td>${buttonHtml}</td>`;

                case 'hidden':
                    return `<td class="display_none">
                        <input type="hidden" data-field="${col.key}" value="${value}">
                    </td>`;
                default:
                    return `<td>${value}</td>`;
            }
        }).join('');

        return `<tr data-id="${rowId}">${tds}</tr>`;
    }).join('');
}

/**
 * 테이블 초기화
 * @param {string} tbodyId
 */
export function clearTable(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
}

/**
 * 테이블 행 버튼 이벤트 공통 처리 (이벤트 위임)
 * @param {string} tableId
 * @param {Object} callbacks { onEdit, onDelete }
 */
 export function initRowHandler(tableId, { onEdit, onDelete, onAdd, onDlls }) {
       const table = document.getElementById(tableId);
       if (!table) return;


        if (table.dataset.bound === 'true') return;     // ⭐ 중복 방지
        table.dataset.bound = 'true';                   // ⭐

       table.addEventListener('click', (e) => {
           const btn = e.target.closest('button');
           if (!btn) return;

           const action = btn.dataset.action;
           const tr = btn.closest('tr');
           if (!tr) return;

           const id = tr.dataset.id;
           if (!id) return;

           if (action === 'edit' && typeof onEdit === 'function') onEdit(id, tr);
           if (action === 'delete' && typeof onDelete === 'function') onDelete(id, tr);
           if (action === 'add' && typeof onAdd === 'function') onAdd(id, tr); // 🔥이제 정상
           if (action === 'dtls' && typeof onDlls === 'function') onDlls(id, tr); // 🔥이제 정상
       });
   }


/**
 * 테이블 행 데이터 추출 (data-field 기준)
 * @param {HTMLTableRowElement} tr
 * @returns {Object}
 */
export function extractRowData(tr) {
    const data = {};
    tr.querySelectorAll('[data-field]').forEach(el => {
        data[el.dataset.field.toLowerCase()] = el.value;
    });
    return data;
}

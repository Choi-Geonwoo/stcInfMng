/* ------------------------------- 공통 유틸 ------------------------------- */
export function fillSelect(id, list, valKey, textKey) {
    const select = document.getElementById(id);

    select.innerHTML = `<option value="">선택</option>`;

    list.forEach((item) => {
        const opt = document.createElement("option");
        opt.value = item[valKey];
        opt.textContent = item[textKey];
        select.appendChild(opt.cloneNode(true));
    });
}
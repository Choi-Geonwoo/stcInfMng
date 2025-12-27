/**
 * 공통 페이지네이션 렌더링
 * @param {Object} options
 * @param {HTMLElement|string} options.container - pagination 컨테이너
 * @param {number} options.page - 현재 페이지
 * @param {number} options.totalPages - 전체 페이지 수
 * @param {Function} options.onPageChange - 페이지 클릭 시 실행 함수
 * @param {number} [options.maxButtons=5] - 표시할 최대 버튼 수
 */
export function renderPagination({
    container,
    page,
    totalPages,
    onPageChange,
    maxButtons = 5
}) {

    const el =
        typeof container === "string"
            ? document.getElementById(container)
            : container;

    if (el) el.innerHTML = "";   // 🔥 위치 중요 (맨 위)

    const safeTotalPages = Number(totalPages);

    // 🔥 데이터 없거나 페이지 1 이하면 숨김
    if (!el || !safeTotalPages || safeTotalPages <= 1) {
        console.log("🔥 페이징 숨김 분기 진입");
        if (el) el.innerHTML = "";
        return;
    }

    el.innerHTML = "";

    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > safeTotalPages) {
        endPage = safeTotalPages;
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const fragment = document.createDocumentFragment();

    if (page > 1) {
        fragment.appendChild(
            createButton("이전", page - 1, onPageChange)
        );
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = createButton(i, i, onPageChange);
        if (i === page) btn.classList.add("active");
        fragment.appendChild(btn);
    }

    if (page < safeTotalPages) {
        fragment.appendChild(
            createButton("다음", page + 1, onPageChange)
        );
    }

    el.appendChild(fragment);
}

/**
 * 페이지 버튼 생성
 */
function createButton(label, page, onPageChange) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.dataset.page = page;

    btn.addEventListener("click", () => {
        onPageChange(page);
    });

    return btn;
}

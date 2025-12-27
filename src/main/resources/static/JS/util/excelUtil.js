/************************************************************/
/*                  엑셀 다운로드 공통 함수                     */
/************************************************************/
export async function downloadExcelFromTable({
    tableId,
    url,
    fileName
}) {
    const columns = extractExcelColumns(tableId);
    console.log(columns);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns })
    });

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName + '.xlsx';
    a.click();

    window.URL.revokeObjectURL(downloadUrl);
}

/************************************************************/
/*                  엑셀 컬럼 정보 추출 (공통 유틸)             */
/************************************************************/
function extractExcelColumns(tableId) {
    const ths = document.querySelectorAll(`#${tableId} thead th`);
    console.log(ths);
    return Array.from(ths)
        .filter(th => th.dataset.key && th.dataset.key !== 'manage')
        .map(th => ({
            key: th.dataset.key,
            header: th.innerText.trim()
        }));
}

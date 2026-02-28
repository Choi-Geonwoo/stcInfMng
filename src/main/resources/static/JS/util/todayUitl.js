

/**
 * 현재 날짜를 지정된 형식으로 반환합니다.
 *
 * @param {string} format - 날짜 형식 (예: 'YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY').
 *                          제공되지 않거나 알 수 없는 형식인 경우 'YYYY-MM-DD'가 기본값으로 사용됩니다.
 * @returns {string} 형식화된 현재 날짜 문자열.
 */
export function getToday(format){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        default:
            // Default to YYYY-MM-DD if no format or unknown format is provided
            return `${year}-${month}-${day}`;
    }
}

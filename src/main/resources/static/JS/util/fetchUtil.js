/**
 * 공통 fetch 함수
 * @param {string} url - 요청 URL
 * @param {string} method - HTTP 메서드 (GET, POST 등)
 * @param {object} [data] - POST/PUT 요청 시 보낼 데이터
 * @returns {Promise<object>} - JSON 응답
 */
export const request = async (url, method = 'GET', data = null) => {
  try {
    const options = { method };

    if (data) {
      if (method.toUpperCase() === 'GET') {
        const params = new URLSearchParams(data.replace("$", "").replace("\\", "")).toString();
        url += `?${params}`;
      } else {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, options);

    // --- 정상 범위 아닌 경우 (400~, 500~, 404 등)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP 오류 ${response.status}: ${errorText || response.statusText}`
      );
    }

    // --- 204 No Content 처리
    if (response.status === 204) return null;

    // --- body가 없을 수 있는 경우
    const text = await response.text();
    if (!text) return null;

    // --- JSON 안전 파싱
    try {
      return JSON.parse(text);
    } catch {
      return text; // JSON이 아니라면 그대로 반환
    }
  } catch (error) {
    console.error('[request error]', error);
    throw error;
  }
};

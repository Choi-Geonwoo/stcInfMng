
import * as Util from '/JS/util/index.js';
// -----------------------------
// ECharts 객체
// -----------------------------
const echarts = window.echarts;

// -----------------------------
// 차트 인스턴스 재사용을 위한 변수
// -----------------------------
let chartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {


    try {
        // -----------------------------
        // 1️⃣ 데이터 조회
        // -----------------------------
        const [summaryRes, stockRankRes, trendRes] = await Promise.all([
            Util.request("/dashboard/summary", "GET"),
            Util.request("/dashboard/stock-rank", "GET"),
            Util.request("/dashboard/dividend-trend", "GET") // 추가
        ]);

        const summary = summaryRes.data[0] ?? {};
        const stockRank = stockRankRes.data ?? [];
//        renderTrendChart(trendRes.data ?? []); // 차트 렌더링 호출
        initDividendTab(trendRes.data ?? []); // 탭 및 초기 차트 초기화

        // -----------------------------
        // 2️⃣ KPI 표시
        // -----------------------------
        setText(totalInvest, summary.TOTALINVEST);
        setText(totalDividend, summary.TOTALDIVIDEND);
        setText(avgDividend, summary.AVGDIVIDEND);
        setText(stockCount, summary.STOCKCOUNT);

        // -----------------------------
        // 3️⃣ 국가별 TOP10 테이블
        // -----------------------------
        renderCountryTables(stockRank);

        // -----------------------------
        // 4️⃣ 주식별 투자금 Bar Chart
        // -----------------------------
        renderStockBar(stockRank);

    } catch (err) {
        console.error("Dashboard 초기화 중 오류 발생:", err);
    }
});



// -----------------------------
// 유틸: 숫자 포맷 후 innerText 설정
// -----------------------------
function setText(element, value, defaultValue = 0) {
    if (!element) return;
    element.innerText = Number(value ?? defaultValue).toLocaleString();
}

// -----------------------------
// 국가별 TOP10 테이블 렌더링
// -----------------------------
function renderCountryTables(stockRank) {
    const container = document.getElementById("country-tables");
    if (!container) return;
    container.innerHTML = '';

    const grouped = stockRank.reduce((acc, item) => {
        if (!acc[item.COUNTRY]) acc[item.COUNTRY] = [];
        acc[item.COUNTRY].push(item);
        return acc;
    }, {});

    Object.entries(grouped).forEach(([country, stocks]) => {
        const section = document.createElement('div');
        section.classList.add('country-section');

        // 섹션 타이틀
        const title = document.createElement('h2');
        title.textContent = `${country} TOP10 주식(배당금 기준)`;
        section.appendChild(title);

        // 테이블 생성
        const table = document.createElement('table');
        table.innerHTML = renderStockRows(stocks);
        section.appendChild(table);
        container.appendChild(section);
    });
}

// -----------------------------
// 테이블 행 렌더링
// -----------------------------
function renderStockRows(stocks) {
    return `
        <thead>
            <tr>
                <th>티커</th>
                <th>종목명</th>
                <th>배당금</th>
                <th>보유수량</th>
            </tr>
        </thead>
        <tbody>
            ${stocks.map(d => `
                <tr>
                    <td>${d.STCKTEA}</td>
                    <td>${d.NAME}</td>
                    <td>${Number(d.INVEST).toLocaleString()}</td>
                    <td>${Number(d.QTY ?? 0).toLocaleString()}</td>
                </tr>`).join('')}
        </tbody>
    `;
}

// -----------------------------
// 주식별 투자금 Bar Chart
// -----------------------------
function renderStockBar(stockRank) {
    if (!stockRank || stockRank.length === 0) return;

    const container = document.getElementById("stockBarContainer");
    if (!container) return;
    container.innerHTML = ''; // 초기화

    // 국가별로 그룹화
    const grouped = stockRank.reduce((acc, item) => {
        if (!acc[item.COUNTRY]) acc[item.COUNTRY] = [];
        acc[item.COUNTRY].push(item);
        return acc;
    }, {});

    Object.entries(grouped).forEach(([country, stocks]) => {
        // 상위 10개 선택
        const top10 = stocks
            .sort((a, b) => (b.INVEST ?? 0) - (a.INVEST ?? 0))
            .slice(0, 10);

        // 차트 div 생성
        const chartDiv = document.createElement('div');
        chartDiv.style.width = '48%';  // 좌우 분리
        chartDiv.style.height = '300px';
        chartDiv.style.display = 'inline-block';
        chartDiv.style.margin = '1%';
        container.appendChild(chartDiv);

        const chart = echarts.init(chartDiv);
        chart.setOption({
            title: { text: `${country} Top10 배당금`, left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: top10.map(d => d.NAME) },
            yAxis: { type: 'value' },
            series: [{
                type: 'bar',
                name: '배당금',
                data: top10.map(d => Number(d.INVEST ?? 0))
            }]
        });
    });
}


// 탭 및 초기 차트 초기화
function initDividendTab(data) {
    const menu = document.getElementById("country-tab-menu");
    if (!menu || data.length === 0) return;

    // 1. 데이터 국가별 그룹화
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.COUNTRY]) acc[item.COUNTRY] = [];
        acc[item.COUNTRY].push(item);
        return acc;
    }, {});

    const countries = Object.keys(grouped);
    menu.innerHTML = '';

    // 2. 탭 버튼 동적 생성
    countries.forEach((country, idx) => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
        btn.textContent = country;

        btn.onclick = (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLineChart(grouped[country], country);
        };
        menu.appendChild(btn);
    });

    // 3. 첫 번째 국가 차트 최초 실행
    renderLineChart(grouped[countries[0]], countries[0]);
}

// ECharts 렌더링 함수
function renderLineChart(data, countryName) {
    const chartDom = document.getElementById('mainTrendChart');
    if (chartInstance) {
        chartInstance.dispose(); // 기존 차트 객체 파기 후 재생성
    }
    chartInstance = echarts.init(chartDom);

    const labels = data.map(d => `${d.MONTH.substring(0,4)}.${d.MONTH.substring(4,6)}`);
    const values = data.map(d => Number(d.TOTAL));

    const option = {
        title: { text: `${countryName} 배당금 추이`, left: 'center', top: 10 },
        tooltip: { trigger: 'axis', formatter: '{b} : <b>{c}원</b>' },
        grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },

        // 바로 이 부분에 위치합니다!
        tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    textStyle: { color: '#333' },
                    formatter: function (params) {
                        let res = `<b>${params[0].name}</b><br/>`;
                        params.forEach(item => {
                            // item.value가 숫자이므로 toLocaleString()으로 콤마 표시
                            res += `${item.marker} ${item.seriesName}: ${Number(item.value).toLocaleString()}원<br/>`;
                        });
                        return res;
                    }
        },

        xAxis: { type: 'category', boundaryGap: false, data: labels },
        yAxis: { type: 'value', axisLabel: { formatter: (value) => value.toLocaleString() } },
        series: [{
            name: '배당금',
            type: 'line',
            smooth: true,
            symbolSize: 10,
            data: values,
            itemStyle: { color: countryName === '대한민국' ? '#5470c6' : '#ee6666' },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(84, 112, 198, 0.4)' },
                    { offset: 1, color: 'rgba(84, 112, 198, 0.0)' }
                ])
            }
        }]
    };

    chartInstance.setOption(option);
    window.onresize = chartInstance.resize;
}

// -----------------------------
// Pie 차트 옵션 생성
// -----------------------------
function pieOption(title, data) {
    if (!data) return {};
    return {
        title: { text: title, left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '60%',
            data: data.map(d => ({ name: d.NAME, value: d.VALUE ?? 0 }))
        }]
    };
}

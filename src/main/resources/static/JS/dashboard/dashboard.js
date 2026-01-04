import * as Util from '/JS/util/index.js';
const echarts = window.echarts;

/* ================= STATE ================= */
const Store = {
    raw: { summary: {}, rank: [], trend: [] },
    filter: { year: '', month: '' },
    chart: null
};

const DOM = {
    totalInvest, totalDividend, avgDividend, stockCount,
    countryTables: document.getElementById("country-tables"),
    stockBars: document.getElementById("stockBarContainer"),
    trendMenu: document.getElementById("country-tab-menu"),
    trendChart: document.getElementById("mainTrendChart"),
    year: document.getElementById("yearFilter"),
    month: document.getElementById("monthFilter")
};

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
    const [s, r, t] = await Promise.all([
        Util.request("/dashboard/summary"),
        Util.request("/dashboard/stock-rank"),
        Util.request("/dashboard/dividend-trend")
    ]);

    Store.raw.summary = s.data[0] ?? {};
    Store.raw.rank    = r.data ?? [];
    Store.raw.trend   = t.data ?? [];

    initFilters(Store.raw.trend);
    render();
});

/* ================= FILTER ================= */
function initFilters(data) {
    const years = [...new Set(data.map(d => d.MONTH.slice(0,4)))];

    DOM.year.innerHTML = `<option value="">전체</option>` +
        years.map(y => `<option value="${y}">${y}</option>`).join('');

    DOM.month.innerHTML = `<option value="">전체</option>` +
        [...Array(12)].map((_, i) =>
            `<option value="${String(i+1).padStart(2,'0')}">${i+1}월</option>`
        ).join('');

    DOM.year.onchange = DOM.month.onchange = () => {
        Store.filter.year = DOM.year.value;
        Store.filter.month = DOM.month.value;
        render();
    };
}

/* Trend 전용 필터 */
const filterTrend = arr => arr.filter(d => {
    const y = d.MONTH?.slice(0,4);
    const m = d.MONTH?.slice(4,6);
    return (!Store.filter.year || y === Store.filter.year) &&
           (!Store.filter.month || m === Store.filter.month);
});

/* ================= RENDER ================= */
function render() {
    renderSummary(Store.raw.summary);
    renderCountryTables(Store.raw.rank);
    renderBars(Store.raw.rank);
    renderTrendTabs(filterTrend(Store.raw.trend));
}

/* ================= SUMMARY ================= */
const num = v => Number(v ?? 0).toLocaleString();
function renderSummary(d) {
    DOM.totalInvest.innerText   = num(d.TOTALINVEST);
    DOM.totalDividend.innerText = num(d.TOTALDIVIDEND);
    DOM.avgDividend.innerText   = num(d.AVGDIVIDEND);
    DOM.stockCount.innerText    = num(d.STOCKCOUNT);
}

/* ================= TABLE ================= */
const group = (arr, key) =>
    arr.reduce((a, v) => ((a[v[key]] ??= []).push(v), a), {});

function renderCountryTables(data) {
    DOM.countryTables.innerHTML = '';
    Object.entries(group(data, 'COUNTRY')).forEach(([c, rows]) => {
        DOM.countryTables.insertAdjacentHTML("beforeend", `
            <div class="country-section">
                <h2>${c} TOP10 주식</h2>
                <table>
                    <thead>
                        <tr><th>티커</th><th>종목</th><th>배당금</th><th>수량</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map(r => `
                            <tr>
                                <td>${r.STCKTEA}</td>
                                <td>${r.NAME}</td>
                                <td>${num(r.INVEST)}</td>
                                <td>${num(r.QTY)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `);
    });
}

/* ================= BAR ================= */
function renderBars(data) {
    DOM.stockBars.innerHTML = '';
    Object.entries(group(data, 'COUNTRY')).forEach(([c, rows]) => {
        const top10 = rows.sort((a,b) => b.INVEST - a.INVEST).slice(0,10);
        const div = document.createElement("div");
        div.style = "width:48%;height:300px;display:inline-block;margin:1%";
        DOM.stockBars.appendChild(div);

        echarts.init(div).setOption({
            title: { text: `${c} Top10 배당금`, left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: top10.map(r => r.NAME) },
            yAxis: { type: 'value' },
            series: [{ type: 'bar', data: top10.map(r => r.INVEST) }]
        });
    });
}

/* ================= TREND ================= */
function renderTrendTabs(data) {
    DOM.trendMenu.innerHTML = '';
    if (!data.length) return;

    const grouped = group(data, 'COUNTRY');
    Object.keys(grouped).forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className = `tab-btn ${i === 0 ? 'active' : ''}`;
        btn.innerText = c;
        btn.onclick = () => drawTrend(c, grouped[c]);
        DOM.trendMenu.appendChild(btn);
    });

    const first = Object.keys(grouped)[0];
    drawTrend(first, grouped[first]);
}

function drawTrend(country, data) {
    Store.chart?.dispose();
    Store.chart = echarts.init(DOM.trendChart);

    Store.chart.setOption({
        title: { text: `${country} 배당금 추이`, left: 'center' },
        tooltip: { trigger: 'axis', formatter: p => `${p[0].name} : ${num(p[0].value)}원` },
        xAxis: { type: 'category', data: data.map(d => `${d.MONTH.slice(0,4)}.${d.MONTH.slice(4,6)}`) },
        yAxis: { axisLabel: { formatter: v => num(v) } },
        series: [{ type: 'line', smooth: true, data: data.map(d => d.TOTAL) }]
    });

    window.onresize = () => Store.chart.resize();
}

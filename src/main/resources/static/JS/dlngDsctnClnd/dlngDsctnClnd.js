document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, getCalendarOptions());
    calendar.render();
});

/* ==============================
 * Calendar Options
 * ============================== */
function getCalendarOptions() {
    return {
        initialView: 'dayGridMonth',
        locale: 'ko',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        navLinks: true,
        selectable: true,
        editable: true,
        dayMaxEvents: true,

        events: loadEvents,
        dateClick: onDateClick,
        eventDidMount: onEventDidMount,
        eventContent: renderEventContent
    };
}

/* ==============================
 * Event Load
 * ============================== */
function loadEvents(fetchInfo, successCallback, failureCallback) {
    const start = fetchInfo.startStr;
    const end = fetchInfo.endStr;
    fetchJson('/dlngDsctnClnd/getAll')
        .then(data => successCallback(data))
        .catch(err => {
            console.error(err);
            alert('이벤트를 불러오지 못했습니다.');
            failureCallback(err);
        });
}

/* ==============================
 * Event Handlers
 * ============================== */
function onDateClick(info) {
    // 추후 확장 포인트
    console.log('date clicked:', info.dateStr);
}

function onEventDidMount(info) {
    const { backgroundColor, textColor } = getEventColors(info.event);
    info.el.style.backgroundColor = backgroundColor;
    info.el.style.color = textColor;
}

function renderEventContent(arg) {
    const props = arg.event.extendedProps || {};

    const dlngAmt = props.DLNGAMT ?? '-';
    const dvdnd  = props.DVDND ?? '-';

    return {
        html: `
            <div class="fc-event-title"><b>${escapeHtml(arg.event.title)}</b></div>
            <div class="fc-event-desc">
                거래금액: ${dlngAmt}<br>
                배당금: ${dvdnd}
            </div>
        `
    };
}

/* ==============================
 * Utils
 * ============================== */
function fetchJson(url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then(json => json.data); // data만 추출
}

function getEventColors(event) {
    // 추후 이벤트 타입별 컬러 분기 가능
    return {
        backgroundColor: '#28a745',
        textColor: '#ffffff'
    };
}

// XSS 방지
function escapeHtml(str = '') {
    return str.replace(/[&<>"']/g, s => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[s]));
}
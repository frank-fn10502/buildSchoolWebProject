Date.prototype.preDays = function (n) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - n);
    return dat;
}
Date.prototype.addDays = function (n = 1) {
    this.setDate(this.getDate() + n);
    return this;
}
Date.prototype.addMonths = function (n = 1) {
    this.setMonth(this.getMonth() + n);
    return this;
}
Date.prototype.sameDay = function (another) {
    return this.getFullYear() == another.getFullYear() &&
        this.getMonth() == another.getMonth() &&
        this.getDate() == another.getDate();
}
Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
};

let calendarList = null;
let currentDate = null;
let pDate = null;
let calenderBody = document.querySelector('.calender-body tbody');


function createRecordEntity() {
    let targets = calenderBody.querySelectorAll('td');
    targets.forEach((target) => {
        calendarList.forEach(data => {
            let source = new Date(data.startDate);
            let targetDate = new Date(target.getAttribute('data-date'))
            if (source.sameDay(targetDate)) {
                let item = target.children[0].children[0].children[1];
                let span = document.createElement('span');
                let title = data.title.substring(0, Math.min(data.title.length, 10));
                if (data.title.length > 10)
                    title += "...";

                span.innerHTML = title;
                item.appendChild(span);
            }
        });
    });
}
function confirm() {
    let startDate = document.querySelector('#startDate').value;
    let endDate = document.querySelector('#endDate').value;
    let tile = document.querySelector('#eventTitle').value;
    let desc = document.querySelector('#desc').value;

    let data = {
        startDate: startDate,
        endDate: endDate,
        title: tile,
        desc: desc
    }
    calendarList.push(data);
    localStorage.setItem('calendar-record', JSON.stringify(calendarList));

    console.log(calendarList);
    createRecordEntity(data);
}
function createDayEntity(offsetWeekday, currentDay, lastDayMonth) {
    let tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        let td = document.createElement('td');
        let cell = document.querySelector('#calendar-cell').content.cloneNode(true);
        let item = cell.querySelector('.item');
        let span = document.createElement('span');
        let tempDate = i < offsetWeekday ? currentDay.preDays(offsetWeekday - i) : currentDay;
        let desc_group = document.createElement('div');
        desc_group.classList.add('desc-group');
        span.innerHTML = tempDate.getDate();

        span.classList.add((i < offsetWeekday || currentDay > lastDayMonth ? 'other' : 'now'));
        if (tempDate.getDay() == 0 || tempDate.getDay() == 6) {
            span.classList.add('holiday');
        }
        if (currentDay.sameDay(currentDate)) {
            td.classList.add('currentDate');
        }
        td.setAttribute('data-date', tempDate.yyyymmdd());
        item.appendChild(span);
        item.appendChild(desc_group);
        td.appendChild(cell)
        tr.appendChild(td);

        td.addEventListener('click', (e) => {
            let eventTitle = document.querySelector('#eventTitle');
            let startTime = document.querySelector('#startDate');
            let endTime = document.querySelector('#endDate');
            let desc = document.querySelector('#desc');

            startTime.value = e.currentTarget.getAttribute('data-date');
            endTime.value = e.currentTarget.getAttribute('data-date');

            eventTitle.value = '';
            desc.value = '';

            this.document.querySelector('.warring.notfitData').style.display = 'none';
            console.log();
            $('#setEventPanel').modal('show');
        });

        if (i >= offsetWeekday)
            currentDay.addDays();
    }
    calenderBody.appendChild(tr);

    return currentDay;
}
function initCalendar(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    let firstDayMonth = new Date(year, month, 1);
    let lastDayMonth = new Date(year, month + 1, 0);
    let offsetWeekday = firstDayMonth.getDay();

    let currentDay = new Date(firstDayMonth.valueOf());

    calenderBody.innerHTML = '';
    document.getElementById('calender-year').innerHTML = `${year} 年`;
    document.getElementById('calender-month').textContent = `${month + 1} 月`;
    for (; currentDay <= lastDayMonth;) {
        currentDay = createDayEntity(offsetWeekday, currentDay, lastDayMonth);
        offsetWeekday = 0;
    }

    createRecordEntity();
}
function initControler(currentDate) {
    let monthSliderLeft = document.querySelector('span.control:first-child');
    let monthSliderRight = document.querySelector('span.control:last-child');

    monthSliderLeft.addEventListener('click', () => {
        pDate.addMonths(-1);
        initCalendar(pDate);
    });
    monthSliderRight.addEventListener('click', () => {
        pDate.addMonths();
        initCalendar(pDate);
    });

    let eventTitle = document.querySelector('#eventTitle');
    let startTime = document.querySelector('#startDate');
    let endTime = document.querySelector('#endDate');
    let desc = document.querySelector('#desc');
    let storeData = document.querySelector('button#confirm');
    storeData.addEventListener('click', () => {
        if (!eventTitle.value || !desc.value) {
            document.querySelector('.warring').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.warring').style.display = 'none';
            }, 2000);
        }
        else {
            let start = new Date(startTime.value);
            let end = new Date(endTime.value);
            if (start > end) {
                document.querySelector('.warring').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.warring').style.display = 'none';
                }, 2000);
            }
            else {
                
                confirm();
                $('#setEventPanel').modal('hide');
            }
        }
    });
}

window.onload = function () {
    calendarList = JSON.parse(localStorage.getItem('calendar-record')) || []; //??


    currentDate = new Date();
    pDate = new Date(currentDate.valueOf());

    initCalendar(currentDate);
    initControler(currentDate);


    // console.log(calendarList);
}

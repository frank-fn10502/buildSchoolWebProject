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
Date.prototype.inInterval = function (start, end) {
    if (typeof start == 'string')
        start = new Date(start);
    if (typeof end == 'string')
        end = new Date(end);
    return this >= start && this <= end;
};

let editIndex = -1;
let calendarList = null;
let currentDate = null;
let clickDate = null;
let pDate = null;
let calenderBody = document.querySelector('.calender-body tbody');


function initEventControlPanel() {
    let title = document.querySelector('#eventControlPanel #editDateTitle');
    let item_group = document.querySelector('#eventControlPanel .list-group');
    title.innerHTML = `${clickDate.getFullYear()}年${clickDate.getMonth()}月${clickDate.getDate()}日`;

    item_group.innerHTML = '';
    calendarList.forEach((data, index) => {
        if (clickDate.inInterval(data.startDate, data.endDate)) {
            let clone = document.querySelector('#edit-item').content.cloneNode(true);
            clone.querySelector('.event-title').innerHTML = data.title;
            clone.querySelector('.start-time').innerHTML = data.startDate;
            clone.querySelector('.end-time').innerHTML = data.endDate;
            let content = clone.querySelector('.content .content');
            let p = document.createElement('p');
            p.innerHTML = data.desc;

            content.innerHTML = '';
            content.appendChild(p);
            clone.querySelector("li").setAttribute('data-index', index);
            item_group.appendChild(clone);
        }
    });
    item_group.querySelectorAll('li').forEach(li => {
        li.addEventListener('click' ,(e) => {
            editIndex = e.currentTarget.getAttribute('data-index');
            let data = calendarList[editIndex];
            let eventTitle = document.querySelector('#eventTitle');
            let startTime = document.querySelector('#startDate');
            let endTime = document.querySelector('#endDate');
            let desc = document.querySelector('#desc');
    
            startTime.value = data.startDate;
            endTime.value = data.endDate;
    
            eventTitle.value = data.title;
            desc.value = data.desc;
    
            this.document.querySelector('.warring.notfitData').style.display = 'none';
            document.querySelector('#delteBtn').style.display = 'block';
            
            $('#setEventPanel').modal('show');
            $('#eventControlPanel').modal('hide');
        });
    })
}
function createRecordEntity() {
    let targets = calenderBody.querySelectorAll('td');
    targets.forEach((target) => {
        let item = target.children[0].children[0].children[1];
        item.innerHTML = '';
        calendarList.forEach((data, index) => {
            let source = new Date(data.startDate);
            let targetDate = new Date(target.getAttribute('data-date'));
            if (source.sameDay(targetDate)) {
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
    if(editIndex < 0)
        calendarList.push(data);
    else
    {
        calendarList[editIndex] = data;
        editIndex = -1;
    }
    localStorage.setItem('calendar-record', JSON.stringify(calendarList));

    console.log(calendarList);
    createRecordEntity();
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
        if (tempDate.sameDay(currentDate)) {
            td.classList.add('currentDate');
        }
        td.setAttribute('data-date', tempDate.yyyymmdd());
        item.appendChild(span);
        item.appendChild(desc_group);
        td.appendChild(cell)
        tr.appendChild(td);

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
    /*-----------------------------td------------------------------------*/
    calenderBody.querySelectorAll('td').forEach(td => {
        td.addEventListener('click', (e) => {

            clickDate = new Date(e.currentTarget.getAttribute('data-date'));
            initEventControlPanel();
            $('#eventControlPanel').modal('show');
        });
    });
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
    let storeData = document.querySelector('#setEventPanel button#confirm');
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

                initEventControlPanel();
                $('#eventControlPanel').modal('show');
            }
        }
    });

    /*-----------------------------addNewEvent------------------------------------*/
    document.querySelector('#addNewEvent').addEventListener('click', (e) => {
        editIndex = -1;
        let eventTitle = document.querySelector('#eventTitle');
        let startTime = document.querySelector('#startDate');
        let endTime = document.querySelector('#endDate');
        let desc = document.querySelector('#desc');

        startTime.value = clickDate.yyyymmdd();
        endTime.value = clickDate.yyyymmdd();

        eventTitle.value = '';
        desc.value = '';

        document.querySelector('#delteBtn').style.display = 'none';
        this.document.querySelector('.warring.notfitData').style.display = 'none';
        console.log();

        $('#setEventPanel').modal('show');
        $('#eventControlPanel').modal('hide');
    });

    /*-----------------------------eventControlPanel confirm------------------------------------*/
    let events_confirm = document.querySelector('#events-confirm');
    events_confirm.addEventListener('click', () => {
        $('#eventControlPanel').modal('hide');
    });

    /*-----------------------------dleteEvent------------------------------------*/
    let delteBtn = document.querySelector('#delteBtn');
    delteBtn.addEventListener('click', () => {
        calendarList.splice(editIndex ,1);
        editIndex = -1;

        localStorage.setItem('calendar-record', JSON.stringify(calendarList));

        console.log(calendarList);
        createRecordEntity();
        initEventControlPanel();

        $('#setEventPanel').modal('hide');
        $('#eventControlPanel').modal('show');
    });

    document.querySelector('#delteBtn').style.display = 'none';
}

window.onload = function () {
    calendarList = JSON.parse(localStorage.getItem('calendar-record')) || []; //??

    currentDate = new Date();
    pDate = new Date(currentDate.valueOf());

    initCalendar(currentDate);
    initControler(currentDate);
}

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
let calenderBody = document.querySelector('.calender-body tbody');

function createDayEntity(offsetWeekday, currentDay, lastDayMonth) {
    let tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        let td = document.createElement('td');
        let cell = document.querySelector('#calendar-cell').content.cloneNode(true);
        let item = cell.querySelector('.item');
        let span = document.createElement('span');
        span.innerHTML = (i < offsetWeekday ? `${currentDay.preDays(offsetWeekday - i).getDate()}` :
                          currentDay.getDate());

        span.classList.add((i < offsetWeekday || currentDay > lastDayMonth ?
                            'other' : 'now'));

        item.appendChild(span);
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
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let firstDayMonth = new Date(year, month, 1);
    let lastDayMonth = new Date(year, month + 1, 0);
    let offsetWeekday = firstDayMonth.getDay();

    let currentDay = new Date(firstDayMonth.valueOf());
    
    calenderBody.innerHTML = '';
    document.getElementById('calender-year').innerHTML = `${year} 年`;
    document.getElementById('calender-month').innerHTML = `${month} 年`;
    for (; currentDay <= lastDayMonth;) {
        currentDay = createDayEntity(offsetWeekday, currentDay, lastDayMonth);
        offsetWeekday = 0;
    }
}
function initControler(currentDate){
    let monthSliderLeft =  document.querySelector('span.control:first-child');
    let monthSliderRight =  document.querySelector('span.control:last-child');
    
    monthSliderLeft.addEventListener('click' ,() =>{
        currentDate.addMonths(-1);
        initCalendar(currentDate);
    });
    monthSliderRight.addEventListener('click' ,() =>{
        currentDate.addMonths();
        initCalendar(currentDate);
    });
    
}

window.onload = function () {
    let currentDate = new Date();
    initCalendar(currentDate);
    initControler(currentDate);
}


import * as model from './guessNumberModel.js';


var control_panel = document.getElementsByClassName('control-panel')[0];
var input_area = document.getElementsByClassName('input-area')[0];
var button_group = document.getElementsByClassName('button-group')[0];
var main_panel = document.getElementsByClassName('main-panel')[0];
var record_panel = document.getElementsByClassName('record-panel')[0];
var maxValue = 100;

function createButton(text) {
    let button = document.createElement('button');
    button.innerHTML = text;
    return button;
}
function startStatus() {
    model.guessNumberGame.answer = Math.floor(Math.random() * 100);
    model.guessNumberGame.guess = '';
    console.log(model.guessNumberGame.answer);

    let gameArea = document.querySelectorAll('div[class*="col-"]:not(:first-child)');
    for(let item of gameArea)
    {
        item.classList.remove('init');
    }
    record_panel.innerHTML= '<ul></ul>';
    control_panel.children[0].className = '';
    input_area.classList.remove('warning-toolTips');
}
function createRecord(result)
{
    let li= document.createElement('li');
    li.classList.add('list-group-item');
    let spanGuess = document.createElement('span');
    let spanResult = document.createElement('span');
    spanGuess.innerHTML = model.guessNumberGame.guess;
    spanResult.innerHTML = result == 0 ? '恭喜通過' : result > 0 ? '太大' : '太小';
    li.appendChild(spanResult);
    li.appendChild(spanGuess);
    spanResult.classList.add(result == 0 ? 'bg-success' : result > 0 ? 'bg-primary' : 'bg-danger');

    return li;
}
function dislayHint(display) {
    let result = model.guessNumberGame.checkAnswer();

    if(result == undefined)
    {
        alert('至少輸入一個數字吧!!');
        return;
    }
    let split = display.value.split('~').map(x => Number(x));
    let myGuess = Number(model.guessNumberGame.guess);
    if( myGuess < split[0] || myGuess > split[1])
    {
        input_area.classList.add('warning-toolTips');
        input_area.children[0].focus();
    }
    else
    {
        if (result > 0) {
            split[1] = model.guessNumberGame.guess
        }
        else if (result < 0) {
            split[0] = model.guessNumberGame.guess
        }
        else {
            let controlArea = document.getElementsByClassName('col-4')[0];
            controlArea.classList.add('init');
            control_panel.children[0].classList.add('btn');
            control_panel.children[0].classList.add('btn-primary');
            alert('you win');
        }
        display.value = split.join(' ~ ');
    
        record_panel.appendChild(createRecord(result));
    }
}

function initView() {
    let input = null;
    let starBtn = createButton('開始遊戲');

    /* after pseudo */
    let gameArea = document.querySelectorAll('div[class*="col-"]:not(:first-child)');
    for(let item of gameArea)
    {
        item.classList.add('init');
    }
    
    /* input */
    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = '';
    // input.classList.add('default');
    input_area.appendChild(input);

    /* answerDisplay */
    let answer = document.createElement('input');
    answer.setAttribute('type', 'text');
    answer.readOnly = true;
    answer.value = 'do not start';
    main_panel.appendChild(answer);

    /* startBtn */
    starBtn.addEventListener('click', function () {
        startStatus();
        this.innerHTML = '重新開始';
        answer.value = `0 ~ ${maxValue}`;
        input.value = model.guessNumberGame.guess;
    });
    control_panel.appendChild(starBtn);

    /* buttonGroup */
    let buttonTextArray = Array.from(Array(12), (item, index) => {
        if (index < 9) return index + 1;
        else {
            switch (index) {
                case 9:
                    return '<i class="far fa-window-close"></i>';
                case 10:
                    return 0;
                case 11:
                    return '<i class="far fa-check-square"></i>';
            }
        }
    });
    buttonTextArray.forEach((item, index, array) => {
        let button = createButton(item);
        let btnBox = document.createElement('div');
        btnBox.classList.add('col-4');
        btnBox.appendChild(button);
        button_group.appendChild(btnBox);

        if (!isNaN(button.innerHTML)) {
            button.addEventListener('click', function () {
                model.guessNumberGame.guess += this.innerHTML.trim();
                input_area.classList.remove('warning-toolTips');
            });
        }
        else if (index == 9) {
            button.addEventListener('click', function () {
                model.guessNumberGame.guess = '';
            });
        }
        else if (index == 11) {
            button.addEventListener('click', function () {
                dislayHint(answer);
                model.guessNumberGame.guess = '';
            });
        }

        button.addEventListener('click', function () {
            input.value = model.guessNumberGame.guess;
        });
    });

    input.addEventListener('keyup',function(e){
        console.log(e.key);
        if(e.keyCode != 13)
        {
            if(isNaN(e.key) && e.keyCode != 8 && e.keyCode != 46)
            {
                input_area.classList.add('warning-toolTips');
                input.value = input.value.replace(/\D/g,'');
            }
            else
            {
                model.guessNumberGame.guess = input.value;
                input_area.classList.remove('warning-toolTips');
            }    
        }
        else
        {
            dislayHint(answer);
            model.guessNumberGame.guess = '';
            input.value = model.guessNumberGame.guess;
        }
    });
}

export { initView };
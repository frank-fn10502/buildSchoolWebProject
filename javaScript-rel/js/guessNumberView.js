var currentGame = null;
var title = document.getElementsByClassName('title')[0];
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
function NumOfDigits(n)
{
    let counter = 0;
    while(n != 0)
    {
        n = parseInt(n/10);
        counter++;
    }
    return counter;
}
function startStatus(length ,noRepeat = false) {
    if(!noRepeat)
        currentGame.answer = Math.floor(Math.random() * length).toString();
    else
    {
        currentGame.answer = '';
        let targetNum = NumOfDigits(length) - 1;
        let list = Array.from(Array(10) ,(item ,index) => item = index);
        for(let i = 0 ; i < targetNum ; i++)
        {
            let randomN = Math.floor(Math.random() * list.length);
            currentGame.answer += list[randomN];
            list.splice(randomN ,1);
        }
    }
    currentGame.guess = '';
    console.log(currentGame.answer);

    let gameArea = document.querySelectorAll('.row>div[class*="col-"]:not(:first-child)');
    for(let item of gameArea)
    {
        item.classList.remove('init');
    }

    record_panel.innerHTML= '<ul></ul>';
    control_panel.children[control_panel.children.length-1].className = '';
    input_area.classList.remove('warning-toolTips');
}
function createRecord(result)
{
    let li= document.createElement('li');
    li.classList.add('list-group-item');
    let spanGuess = document.createElement('span');
    let spanResult = document.createElement('span');
    spanGuess.innerHTML = currentGame.guess;
    spanResult.innerHTML = result == 0 ? '恭喜通過' : result > 0 ? '太大' : '太小';
    li.appendChild(spanResult);
    li.appendChild(spanGuess);
    spanResult.classList.add(result == 0 ? 'bg-success' : result > 0 ? 'bg-primary' : 'bg-danger');

    return li;
}
function dislayHint(display) {
    let result = currentGame.checkAnswer();

    if(result == undefined)
    {
        alert('至少輸入一個數字吧!!');
        return;
    }

    if(display)
    {
        let split = display.value.split('~').map(x => Number(x));
        let myGuess = Number(currentGame.guess);
        if( myGuess < split[0] || myGuess > split[1])
        {
            input_area.classList.add('warning-toolTips');
            input_area.children[0].focus();
        }
        else
        {
            if (result > 0) {
                split[1] = currentGame.guess
            }
            else if (result < 0) {
                split[0] = currentGame.guess
            }
            else {
                let controlArea = document.querySelectorAll('.row>div[class*="col-"]:not(:first-child)')[0];
                controlArea.classList.add('init');
                control_panel.children[control_panel.children.length-1].classList.add('btn');
                control_panel.children[control_panel.children.length-1].classList.add('btn-primary');
                document.activeElement.blur();
                input_area.classList.remove('warning-toolTips');
                alert('you win');
            }
            display.value = split.join(' ~ ');
        
            record_panel.appendChild(createRecord(result));
            record_panel.scrollTop = record_panel.scrollHeight;
        }
    }
    else
    {
        if(result == -1)
        {
            input_area.classList.add('warning-toolTips');
            input_area.children[0].focus();
        }
        else 
        {
            let r = -1;
            if(result == "4A0B")
            {
                r = 0;
                let controlArea = document.querySelectorAll('.row>div[class*="col-"]:not(:first-child)')[0];
                controlArea.classList.add('init');
                control_panel.children[control_panel.children.length-1].classList.add('btn');
                control_panel.children[control_panel.children.length-1].classList.add('btn-primary');
                document.activeElement.blur();
                input_area.classList.remove('warning-toolTips');
                alert('you win');
            }

            let record = createRecord(r);
            record.children[0].innerHTML = result;
            record_panel.appendChild(record);
            record_panel.scrollTop = record_panel.scrollHeight;
        }
    }
   
}

function initView(selectModel ,needHint = true ,length = 100 ,noRepeat = false) {
    if(selectModel != null)
    {
        currentGame = selectModel;
    }
    record_panel.innerHTML= '<ul></ul>';
    input_area.classList.remove('warning-toolTips');
    let input = null;
    let starBtn = createButton('開始遊戲');

    /* title */
    title.children[0].innerHTML = currentGame.name;

    /* after pseudo */
    let gameArea = document.querySelectorAll('.row>div[class*="col-"]:not(:first-child)');
    for(let item of gameArea)
    {
        item.classList.add('init');
    }
    
    /* input */
    input_area.innerHTML = '';
    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = '';
    input_area.appendChild(input);

    /* answerDisplay */
    main_panel.innerHTML = '';
    let answer = null;
    if(needHint)
    {
        answer = document.createElement('input');
        answer.setAttribute('type', 'text');
        answer.readOnly = true;
        answer.value = 'do not start';
        main_panel.appendChild(answer);

        main_panel.style.display = "block";
        record_panel.style.maxHeight = "180px";
    }
    else
    {
        main_panel.style.display="none";
        record_panel.style.maxHeight = "230px";
    }
    
    /* startBtn */
    control_panel.removeChild(control_panel.lastChild);
    starBtn.addEventListener('click', function () {
        startStatus(length ,noRepeat);
        this.innerHTML = '重新開始';
        if(answer)
        {
            answer.value = `0 ~ ${maxValue}`;
        }
        
        input.value = currentGame.guess;
    });
    control_panel.appendChild(starBtn);
    

    /* buttonGroup */
    button_group.innerHTML = '';
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
                currentGame.guess += this.innerHTML.trim();
                input_area.classList.remove('warning-toolTips');
            });
        }
        else if (index == 9) {
            button.addEventListener('click', function () {
                currentGame.guess = '';
            });
        }
        else if (index == 11) {
            button.addEventListener('click', function () {
                dislayHint(answer);
                currentGame.guess = '';
            });
        }

        button.addEventListener('click', function () {
            input.value = currentGame.guess;
        });
    });

    input.addEventListener('keyup',function(e){
        // console.log(e.key);
        if(e.keyCode != 13)
        {
            if(isNaN(e.key) && e.keyCode != 8 && e.keyCode != 46 
            && input.value.length > currentGame.guess.length)
            {
                input_area.classList.add('warning-toolTips');
                input.value = input.value.replace(/\D/g,'');
            }
            else
            {
                input_area.classList.remove('warning-toolTips');
                currentGame.guess = input.value;
            }    
        }
        else
        {
            dislayHint(answer);
            currentGame.guess = '';
            input.value = currentGame.guess;
        }
    });
}

export { initView };
import * as model from './calculatorModel.js';

var control_panel = document.getElementsByClassName('control-panel')[0];
var record_panel = document.getElementsByClassName('record')[0];
var buttonTextList = [['x^2' ,'1/x' ,'|x|' ,'C' ,'←'],
                      ['x^3' ,'(' ,')' ,'n!' ,'%'],
                      ['x^y' ,'7' ,'8' ,'9' ,'/'],
                      ['10^x' ,'4' ,'5' ,'6' ,'×'],
                      ['log' ,'1' ,'2' ,'3' ,'-'],
                      ['pi' ,'0' ,'.' ,'=' ,'+'],];


function createButton(text)
{
    let button = document.createElement('button');
    button.innerHTML = text;

    return button;
}

export function init()
{
    /* input */
    let box = document.getElementsByClassName('input')[0];
    for(let i = 0 ; i < 2 ; i++)
    {
        let input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = 'test';
        box.appendChild(input);
    }

    /* button group */
    let mainInput = document.querySelector('.control-panel .input input:last-child');
    let secondInput = document.querySelector('.control-panel .input input:first-child');

    /* init status */
    mainInput.value = '';
    secondInput.value = '';

    let operandFunc = (e = null) => 
    { 
        if(typeof e != 'string')
            mainInput.value += e.target.innerHTML.trim();
        else
        {
            mainInput.value += r.trim();
        }
    };
    let operatorFunc = (e = null) => 
    { 
        if(typeof e != 'string')
            mainInput.value += ` ${e.target.innerHTML.trim()} `;
        else
        {
            mainInput.value += ` ${r.trim()} `;
        }
    };

    let btn_group = document.getElementsByClassName('button-group')[0];
    buttonTextList.forEach((item ,index) => {
        item.forEach((x ,y) => {
            let b = createButton(x);
            let box = document.createElement('div');
            box.className = 'box';
            box.appendChild(b);
            btn_group.appendChild(box);

            if(!isNaN(x) || x == '.')
                b.addEventListener('click' ,function(e){
                    operandFunc(e);
                });
            else
            {
                switch(x)
                {
                    case 'C':
                        b.addEventListener('click' ,function(e){
                            mainInput.value = '';
                            secondInput.value = '';
                        });
                        break;
          
                        case '←':
                        b.addEventListener('click' ,function(e){
                            let need = false;
                            mainInput.value = mainInput.value.trim();
                            need = isNaN(mainInput.value.slice(mainInput.value.length-1 ,1));
                            mainInput.value = mainInput.value.slice(0 ,-1);
                            if(need)
                                mainInput.value = mainInput.value.trim();
                        });
                        break;

                    default:
                        if(x.length == 1)
                        {
                            if(x == '=')
                            {
                                b.addEventListener('click' ,function(e){
                                    secondInput.value = mainInput.value;
                                    mainInput.value = model.calculator.cal(mainInput.value);
                                });

                            }
                            else if(x == ')')
                            {
                                b.addEventListener('click' ,function(e){
                                    if(mainInput.value.includes('('))
                                    {
                                        operatorFunc(e);
                                    }
                                });
                            }
                            else
                            {
                                b.addEventListener('click' ,function(e){
                                    operatorFunc(e);
                                });
                            }
                        }
                        else
                        {
                            b.addEventListener('click' ,function(e){
                                console.log('no event now');
                            });     
                        }
                }
            }
        });
    });
}
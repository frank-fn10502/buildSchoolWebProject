let gameArea = document.querySelector('.game-area');
let startBtn = document.querySelector('#start');
let autoBtn = document.querySelector('#autoCompletion');
let imgList = [];
let partsNum = 3;
let offsetImg = 10;
var isStart = false;

let maxEdge = 9;
let sourceFileNum = 3;
let rootDataFile = './imgs/puzzle/';
let currentFile = '';

let animater = null;
let animate = null;
let sign = [];
let moveMaxTimes = 0;
let moveTotalTimes = 0;
let moveUnit = 0;
let totalAnimationTime = 250;
let intervalTime = 20;
let animaSource, animaTarget;


let autoList = [];
let openList = [];
let closeList = []; //二元搜尋樹(not yet)
let finishedList = [[0, 0], [0, 1], [0, 2],
                    [1, 0], [1, 1], [1, 2],
                    [2, 0], [2, 1], [2, 2]];
// let node = {
//     parent : '',
//     child: [],
//     key:'012345678'//一串編碼(二元搜尋數) ,8: blank
// }
let animaSourceList = [];
let animaTargetList = [];
let animaterList = [];
let signList = [];

function createAutoList() {
    autoList = []
    let startIndex = 0;
    let row = 0, col = 0;
    let rowList = [];
    imgList.forEach(x => {
        let item = x.querySelector('img');

        if (item) {
            let id = Number(item.getAttribute('data-id'));
            rowList.push(id);
        }
        else {
            rowList.push(partsNum*partsNum-1);
            startIndex = [row ,col];
        }

        if (col >= partsNum-1) {
            autoList.push(rowList);
            rowList = [];
            row++;
            col = 0;
        }
        else col++;
    });
    return startIndex;
}
function createNodeKey(pattern) {
    let result = '';
    pattern.forEach(items => {
        items.forEach(x=> {
            result += x.toString();
        });
    });
    return result;
}
function h(pattern) {
    let result = 0;
    pattern.forEach((items, row) => {
        items.forEach((item, col) => {
            let r = Math.abs(row - finishedList[item][0]);
            r += Math.abs(col - finishedList[item][1]);
            result += r;
        });
    });
    return result;
}
async function autoCompletion() {
    totalAnimationTime = 100;
    intervalTime = 10;
    resizeImg();

    let isFind = false;
    let startIndex = createAutoList(); //[rwo ,col]
    // debugger
    openList = [];
    closeList = [];
    animaSourceList = [];
    animaTargetList = [];
    animaterList = [];
    signList = [];

    let f = (g ,pattern) => Number(g) + h(pattern);
    let copyArray = (array) =>{
        let newArray = JSON.stringify(array);
        newArray = JSON.parse(newArray);
        return newArray;
    }
    let findNewPattern = (nowIndex ,pattern ,i) =>{
        let dirList = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        let patternList = dirList.filter(x =>{
            let row = nowIndex[0] + x[0]; 
            let col = nowIndex[1] + x[1]; 
            return !(row < 0 ||  row >= partsNum || col < 0 || col >= partsNum);
        }).map(x =>{
            let row = nowIndex[0] + x[0]; 
            let col = nowIndex[1] + x[1]; 
            return [row ,col];
        }).map(x =>{
            let newAutoList = copyArray(pattern);
            let temp = newAutoList[x[0]][x[1]];
            newAutoList[x[0]][x[1]] = newAutoList[nowIndex[0]][nowIndex[1]];
            newAutoList[nowIndex[0]][nowIndex[1]] = temp;

            let result = createNodeKey(newAutoList);
            if(closeList.findIndex(x => x.key == result) == -1)
            {
                return [x ,newAutoList ,f(i ,newAutoList)];
            }
            else{
                return undefined
            }
        }).filter(x => x);

        return patternList;
    };

    console.log('autoList' ,autoList);
    let newAutoList = copyArray(autoList);

    let current = {
        parent: null,
        data: [startIndex ,newAutoList ,f(0 ,newAutoList)],
        //blankIndex ,parten ,f()
        key: createNodeKey(newAutoList),//一串編碼(二元搜尋數) ,8: blank       
        level: 0
    }
    openList.push(current);
    for(let i = 1 ; !isFind ;) 
    {
        current = openList[0];
        let movePatternList = findNewPattern(current.data[0] ,current.data[1] ,current.level+1);
        openList.splice(openList.indexOf(current) ,1);
        closeList.push(current);

        for(let item of movePatternList)
        {
            let result = createNodeKey(item[1]);
            let findIndex = openList.findIndex(x => x.key == result);
            let node = {
                parent: current,
                data : item,
                key: result,
                level: current.level+1
            }
            if(findIndex != -1)
            {
                let oldFn = openList[findIndex].data[2];
                let newFn = item[2];
                if(oldFn > newFn)
                {
                    openList[findIndex].parent = node;
                    openList[findIndex].level = node.level + 1;
                    openList[findIndex].data = item;
                }
            }
            else
            {
                if(result == '012345678')
                {
                    current = node;
                    isFind = true;
                    break;
                }
                openList.push(node);
            }
        }
        openList.sort((a,b) =>{
            return a.data[2] - b.data[2];
        });
        // console.log(current.level ,openList.length ,closeList.length);
    }

    let path = [];
    while(current != null)
    {
        path.push(current.data[0]);
        current = current.parent;
    }
    path = path.reverse();
    console.log(path);

    let pre = null;

    for(let x of path)
    {
        if(pre != null && (pre[0] != x[0] || pre[1] != x[1]))
        {
            animaSourceList.push(x);
            animaTargetList.push(pre);
            animaterList.push(Array.from(imgList).find(y => {
                let result  = y.getAttribute('data-index').split(' ')
                                .map(x => Number(x));
                result = Math.abs(result[0] - x[0]) + Math.abs(result[1] - x[1]);
                return result == 0;
            }).parentElement);
            signList.push([pre[1] - x[1] ,pre[0] - x[0]]);
        }
        pre = x;
    }
    animation();
}

function animation() {
    if(!isStart) 
    {
        clearTimeout(animate);
        animater = null;
        return;
    }

    if(animater == null && animaSourceList.length > 0)
    {
        animater = animaterList[0];
        animaSource = animaSourceList[0];
        animaTarget = animaTargetList[0];
        sign = signList[0];
    }

    animater.style.left = `${moveUnit * moveTotalTimes * sign[0]}px`;
    animater.style.top = `${moveUnit * moveTotalTimes * sign[1]}px`;
    moveTotalTimes++;
    // console.log(`${moveUnit * moveTotalTimes * sign[0]}px`);

    if ( moveTotalTimes < moveMaxTimes)
        animate = setTimeout(animation, 20);
    else {
        clearTimeout(animate);
        moveTotalTimes = 0;
        animater.style.left = 0;
        animater.style.top = 0;
        change(animaSource, animaTarget);

        animater = null;
        if (checkStatus()) {
            console.log('you win');
            setTimeout(()=>{
                if(isStart)
                    alert('you win');
            },50);
            

            startBtn.disabled = false;
            startBtn.classList.remove('btn-secondary');
            startBtn.classList.add('btn-primary' ,'aliveBtn');
        }

        animaterList.splice(0, 1);
        animaSourceList.splice(0, 1);
        animaTargetList.splice(0, 1);
        signList.splice(0, 1);
        if(animaSourceList.length > 0)
        {
            animation();
        }
    }
}
function checkStatus() //是否勝利...
{
    let pre = -1;
    let counter = 0;
    for (let item of imgList) {
        let data = item.querySelector('img');
        counter++;
        if (data) {
            data = Number(data.getAttribute('data-id'));
            if (pre - data != -1) return false;

            pre = data;
        }
        else if (counter < 9) {
            return false;
        }
    }
    return true;
}
function twoD2OneD(a) {
    let row = Number(a[0]);
    let col = Number(a[1]);
    return row * partsNum + col;
}
function findMovePos(data) {
    let dirList = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    for (let item of dirList) {
        let rx = Number(data[0]) + item[0];
        let ry = Number(data[1]) + item[1];
        if ((rx < 0 || ry < 0) || (rx >= partsNum || ry >= partsNum)) {
        }
        else {
            let result = twoD2OneD([rx, ry]);

            result = imgList[result];
            result = result.querySelector('img');
            if (result == null) {
                sign = [item[1], item[0]];//col:x(左右) ,row:y(上下)
                // console.log(sign);
                return [rx, ry];
            }
        }
    }
}
function change(i1, i2) {
    try
    {
        let img = imgList[twoD2OneD(i1)].querySelector('img');
        imgList[twoD2OneD(i2)].appendChild(img);
    }
    catch(e)
    {
        console.log(imgList[twoD2OneD(i1)].querySelector('img') ,imgList[twoD2OneD(i2)]);
        debugger;
    }
}
function displayRandom() {
    let r = partsNum * 30;
    let pComponent = imgList[partsNum * partsNum - 1];
    for (let i = 0; i < r; i++) {
        let pData = pComponent.getAttribute('data-index').split(' ');
        let dirList = [[-1, 0], [0, -1], [1, 0], [0, 1]];

        dirList = dirList.filter(item => {
            let rx = Number(pData[0]) + Number(item[0]);
            let ry = Number(pData[1]) + Number(item[1]);
            // console.log(rx ,ry ,'  ' ,Number(item[0]) , Number(item[1]));
            if ((rx < 0 || ry < 0) || (rx >= partsNum || ry >= partsNum)) {
                return false;
            }
            else {
                return true;
            }
        });
        let move = dirList[Math.floor(Math.random() * dirList.length)];
        let source = [Number(pData[0]) + Number(move[0]), Number(pData[1]) + Number(move[1])]
        let target = pData;
        change(source, target);
        pComponent = imgList[twoD2OneD(source)];
    }
}
function resizeImg() {
    if (!imgList) return undefined;

    let partComponent = document.querySelector('.item-group .component');
    let h = partComponent.offsetHeight;
    let w = partComponent.offsetWidth;
    let partW = -(w);
    let partH = -(h);


    moveMaxTimes = (totalAnimationTime / intervalTime);
    moveUnit = w / moveMaxTimes;
    if (animater) {
        animater.style.left = `${moveUnit * moveTotalTimes * sign[0]}px`;
        animater.style.top = `${moveUnit * moveTotalTimes * sign[1]}px`;
    }


    imgList.forEach(item => {
        item = item.querySelector('img');
        if (item) {
            let index = item.getAttribute('data-id');
            // index = twoD2OneD(index);
            // console.log(item ,index);
            let row = Math.floor(index / partsNum);
            let col = index % partsNum;

            // console.log(item);
            item.style.height = `${h * partsNum}px`;
            item.style.width = `${w * partsNum}px`;

            // item.style.objectPosition = `${partW * col}px ${partH * row}px`;
            item.style.transform = `translate(${partW * col}px,${partH * row}px)`;
            // console.log(`${partW * col} ${partH * row}`);
        }
    });
}
function initGameArea(index, n, needImg = true) {
    let item_group = gameArea.querySelector('.item-group');

    let frame = document.createElement('div');
    let item = document.createElement('div');
    let component = document.createElement('div');
    let row = Math.floor(index / partsNum);
    let col = index % partsNum;

    if (needImg) {
        let img = document.createElement('img');
        img.src = rootDataFile + currentFile;
        img.setAttribute('data-id', `${index}`);
        component.appendChild(img);

        img.addEventListener('click', (e) => {
            let data = e.target.parentElement.getAttribute('data-index').split(' ');
            let resultIndex = findMovePos(data);

            if (resultIndex) {
                animaSource = data;
                animaTarget = resultIndex;
                animater = e.target.parentElement.parentElement;
                animation();
            }
        });

    }
    component.setAttribute('data-index', `${row} ${col}`);

    item.appendChild(component);
    frame.appendChild(item);
    item_group.appendChild(frame);

    component.classList.add('component');
    item.classList.add('item');
    frame.classList.add('frame');
    frame.style.width = `${1 / n * 100}%`;
}


function initGame() {
    totalAnimationTime = 250;
    intervalTime = 20;
    let item = document.createElement('div');
    let img = document.createElement('img');
    gameArea.querySelector('.item-group').innerHTML = '';
    img.src = rootDataFile + currentFile;

    item.classList.add('item');
    img.classList.add('component');
    item.appendChild(img);
    gameArea.querySelector('.item-group').appendChild(item);

    startBtn.innerHTML = '開始遊戲';
    isStart = false;

    autoBtn.disabled = true;
    autoBtn.classList.add('btn-secondary');
    autoBtn.classList.remove('btn-primary' ,'aliveBtn' ,'ml-2');
    startBtn.disabled = false;
    startBtn.classList.remove('btn-secondary');
    startBtn.classList.add('btn-primary' ,'aliveBtn');
}
function startGame() {
    gameArea.querySelector('.item-group').innerHTML = '';
    for (let i = 0; i < partsNum * partsNum; i++) {
        initGameArea(i, partsNum, i != partsNum * partsNum - 1);
    }
    imgList = document.querySelectorAll('.game-area .component');

    finishedList = [];
    for (let i = 0; i < partsNum ; i++) {
        for (let j = 0; j < partsNum ; j++) {
            finishedList.push([i ,j]);
        }
    }
    console.log(finishedList);
    console.log(imgList);

    resizeImg();
    if(partsNum == 3)
    {
        autoBtn.disabled = false;
        autoBtn.classList.add('btn-primary' ,'aliveBtn');
        autoBtn.classList.remove('btn-secondary');
    }
}
function initGameSetting() {
    /* -----------------autoBtn-------------------- */
    autoBtn.addEventListener('click', (e) => {
        autoBtn.disabled = true;
        autoBtn.classList.add('btn-secondary' ,'ml-2');
        autoBtn.classList.remove('btn-primary' ,'aliveBtn');

        startBtn.disabled = true;
        startBtn.classList.add('btn-secondary');
        startBtn.classList.remove('btn-primary' ,'aliveBtn');

        autoCompletion();
    });

    /* -----------------start-------------------- */
    startBtn.addEventListener('click', (e) => {
        if (!isStart) {
            startGame();
            displayRandom();
            e.target.innerHTML = '重新開始';
            isStart = true;
        }
        else initGame();
    });

    /* -----------------select-------------------- */
    let select = document.querySelector('#game-difficulty');
    select.innerHTML = '';
    for (let i = 3; i <= maxEdge; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = `${i} × ${i}`;
        select.appendChild(option);
    }
    select.addEventListener('change', (e) => {
        partsNum = e.target.value;
        initGame();
    });

    /* -----------------fileOnlineDropDown------- */
    let dropDown = document.querySelector('#file-selecct');
    dropDown.innerHTML = '';
    for (let i = 1; i <= sourceFileNum; i++) {
        let btn = document.createElement('button');
        btn.classList.add('list-group-item',
            'list-group-item-action');
        btn.innerHTML = `source_0${i}`;
        btn.setAttribute('data-fileName', `source_0${i}`);

        btn.addEventListener('click', (e) => {
            dropDown.querySelectorAll('button').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
            currentFile = `${e.target.getAttribute('data-fileName')}.jpg`;
            initGame();
        });
        dropDown.appendChild(btn);
    }
    dropDown.querySelectorAll('button')[0].classList.add('active');
    currentFile = `source_0${1}.jpg`;
}
window.onload = function () {
    window.onresize = resizeImg;

    initGameSetting();
    initGame();



    console.log('done');
}
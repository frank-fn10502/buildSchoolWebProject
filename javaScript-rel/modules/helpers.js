function $g(selector){
    if(selector.includes('#') && !selector.includes(' '))
    {
        return document.querySelector(selector);
    }

    let nodeList = document.querySelectorAll(selector);
    return nodeList.length == 1 ? nodeList[0] : nodeList;
}
function $c(selector)
{
    return document.createElement(selector);
}
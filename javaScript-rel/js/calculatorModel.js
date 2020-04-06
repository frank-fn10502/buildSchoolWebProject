export var calculator = {
    cal: (str) => {
        str = str.replace('×' ,'*');
        console.log(eval(str));
        return eval(str);
    }
};
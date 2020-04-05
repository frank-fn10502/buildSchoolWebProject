var Cars = ['BMW', 'Benz', 'Audi', 'Lexus'];
var Prices = [280, 320, 250, 210];


console.log("hw01:");
for (let i = 0; i < Cars.length; i++) {
    Prices[i] *= 1.05;
    console.log(`企業:${Cars[i]}: ${Prices[i]}`);
}


var Cars = ['BMW', 'Benz', 'Audi', 'Lexus'];
var Prices = [280, 320, 250, 210];
var company =
[
    Cars,
    Prices
];
company[1] = company[1].map(x => x * 1.05);
console.log("\nhw02:");
for (let i = 0; i < Cars[0].length; i++) {
    console.log(`企業:${company[0][i]}: ${company[1][i]}`);
}
var total = company[1].map(x => x * 1.05).reduce((pre ,now) => pre + now);
console.log(total);
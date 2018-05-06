//my Files:
const funcs = require("./functions/mainFunctions");
const coins = require("./coins");

var conditionals = process.argv[3] === "no" ? false : true;

if(process.argv[2] === "all"){
  funcs.findGoodCoins(coins, conditionals);
}else{
  if(coins.indexOf(process.argv[2]) === -1){
    console.log("Could not find coin");
    process.exit();
  }else{
    var coinArr = [];
    coinArr.push(process.argv[2]);
    funcs.findGoodCoins(coinArr, conditionals);
  }
}

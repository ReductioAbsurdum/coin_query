const request = require("request");
const conditionalFuncs = require("./conditionalFunctions");
const helperFuncs = require("./helperFunctions");
const chalk = require("chalk");


module.exports.findGoodCoins = (coins, withConitions) => {

  coins.forEach((coin)=>{
    var twodays = (Date.now() - (48 * 3600 * 1000));
    var oneday = (Date.now() - (24 * 3600 * 1000));
    var now = Date.now();

    Promise.all([requestAsync(coin, now, "current day"),
                 requestAsync(coin, oneday, "One day ago"),
                 requestAsync(coin, twodays, "Two days ago")])
        .then(function(result) {
          var allData = helperFuncs.parseData(result);

          var sellPrice = (allData[0].lastClosePrice * 0.12) + allData[0].lastClosePrice;

          if(withConitions){
            var isHighTwentyFourHrPercent = conditionalFuncs.testTwentyFourHourPercent(allData);
            var isTenPercentUnderHighAvgs = conditionalFuncs.testTenPercentUnderHighAvgs(allData);
            var ismustSellPriceBelowThreeDays = conditionalFuncs.mustSellPriceBelowThreeDays(sellPrice, allData);
          }else{
            var isHighTwentyFourHrPercent = true;
            var isTenPercentUnderHighAvgs = true;
            var ismustSellPriceBelowThreeDays = true;
          }

          if(isHighTwentyFourHrPercent && isTenPercentUnderHighAvgs && ismustSellPriceBelowThreeDays){

            for(var i = 0; i <  allData.length; i++){
              var highDateString = new Date(allData[i].highDate);
              var lowDateString = new Date(allData[i].lowDate);
              var beginDateString = new Date(allData[i].beginDate);
              var endDateString = new Date(allData[i].endDate);
              var averagePrice = Math.round(allData[i].averagePrice * 100000000) / 100000000;
              var mustSellAtPrice = Math.round(sellPrice * 100000000) / 100000000;

              console.log(allData[i].coinSym + " :");
              console.log(allData[i].day + " :");
              console.log(`Block Start Date = ${beginDateString.toLocaleDateString('en-US')} ${beginDateString.toLocaleTimeString('en-US')}`);
              console.log(`Block End Date = ${endDateString.toLocaleDateString('en-US')} ${endDateString.toLocaleTimeString('en-US')}`);
              console.log("Last close price = " + allData[i].lastClosePrice);
              if(i === 0)
                console.log("Must sell at = " + mustSellAtPrice);
              console.log(chalk.green("high = " + allData[i].high));
              console.log(`high Date = ${highDateString.toLocaleDateString('en-US')} ${highDateString.toLocaleTimeString('en-US')}`);
              console.log(chalk.red("low = " + allData[i].low));
              console.log(`low Date = ${lowDateString.toLocaleDateString('en-US')} ${lowDateString.toLocaleTimeString('en-US')}`);
              console.log(`Average close price : ${averagePrice}`);
              console.log("24 hr difference percent = " + allData[i].twentyFourHourDifference);
              console.log("\n");
            }

            }

        }, function(Allerr){
          console.log(Allerr);
          process.exit();
        });
  });
}


requestAsync = (coinSym, time, day) => {
  return new Promise(function(resolve, reject) {
      request(
        "https://api.binance.com/api/v1/klines?symbol=" + coinSym + "&interval=5m&limit=288&endTime=" + time,
        function(err, res, body) {
          if (err) { return reject(err); }

              var data = JSON.parse(body);

              var index = 0;
              var high = 0;
              var highDate = "";
              var low = 0;
              var lowDate = "";
              var beginDate = "";
              var endDate = "";
              var averagePrice = 0;

              for(var i = 0; i < data.length; i++){

                averagePrice += parseFloat(data[i][4]);

                if(high < data[i][4]){
                  high = data[i][4];
                  highDate = data[i][6];
                }

                if(low > data[i][4] || low === 0){
                  low = data[i][4];
                  lowDate = data[i][6];
                }

                var temp = (Math.abs(data[index][4] - data[i][4])/data[index][4]) * 100;

                if(temp >= 10){
                  index = i;
                }
              }

              averagePrice /= data.length;

              var result = new Object();
              result.coinSym = coinSym;
              result.day = day;
              result.high = high;
              result.highDate = highDate;
              result.low = low;
              result.lowDate = lowDate;
              result.twentyFourHourDifference = ((high - low) / high) * 100;
              result.lastClosePrice = data[data.length - 1][4];
              result.beginDate = data[0][0];
              result.endDate = data[data.length - 1][6];
              result.averagePrice = averagePrice;

          return resolve(result);

      });
  }, function(err){
    console.log("There was an error getting the data!");
    console.log(err);
    process.exit();
  });
}

module.exports.twentyFour = (coinSym) => {
  axios.get("https://api.binance.com/api/v1/ticker/24hr?symbol=" + coinSym)
  .then((res)=>{
    console.log(res.data);
  });
}






//

module.exports = {
  testTwentyFourHourPercent : function (data){
    if(data[0].twentyFourHourDifference > 10 &&
       data[1].twentyFourHourDifference > 10 &&
       data[2].twentyFourHourDifference > 10
     ){
       return true;
     }else{
       return false;
     }
  },
  testTenPercentUnderHighAvgs : function (data){
    var highAvg = (data[0].high + data[1].high + data[2].high) / 3;
    var diffAvg = ((highAvg - data[0].lastClosePrice) / highAvg) * 100;
    return (diffAvg > 9) ? true : false;
  },
  mustSellPriceBelowThreeDays : function (mustSellPrice, data){
    if(mustSellPrice < data[0].high && mustSellPrice < data[1].high && mustSellPrice < data[2].high){
      return true;
    }else{
      return false;
    }
  }
}

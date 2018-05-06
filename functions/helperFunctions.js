module.exports.parseData = (data) => {
  data.forEach((item)=>{
    item.high = parseFloat(item.high);
    item.low = parseFloat(item.low);
    item.twentyFourHourDifference = parseFloat(item.twentyFourHourDifference);
    item.lastClosePrice = parseFloat(item.lastClosePrice);
  });
  return data;
}

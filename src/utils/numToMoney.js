const numToMoney = function (num) {
  if (num === undefined || num === null) {
    num = 0;
  }
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  return num;
};

export default numToMoney;
const numToMoney = function (num) {
  if (num === undefined || num === null) {
    num = 0;
  }
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();

  let stringNum = num.split(".");
  if (stringNum.length == 1) {
    num = num + ".00";
  }
  if (stringNum.length > 1) {
    if (stringNum[1].length < 2) {
      num = num + "0";
    }
  }
  return num;
};

export default numToMoney;
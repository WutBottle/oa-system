const numToMoney = function (num) {
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  return num;
};

export default numToMoney;
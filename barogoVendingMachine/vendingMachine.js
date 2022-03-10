// 음료 및 잔액 정보
const drink = {
  1: { name: 'Cola', price: 1100, amount: 10, availability: false },
  2: { name: 'Water', price: 600, amount: 10, availability: false },
  3: { name: 'Coffee', price: 700, amount: 10, availability: false },
};
const changeCoin = {
  coin: {
    10000: { amount: 1 },
    5000: { amount: 1 },
    1000: { amount: 1 },
    500: { amount: 1 },
    100: { amount: 1 },
  },
};
const inputCoin = {
  coin: {
    10000: { amount: 0 },
    5000: { amount: 0 },
    1000: { amount: 0 },
    500: { amount: 0 },
    100: { amount: 0 },
  },
};

// 결제 방식
const checkCard = {
  type: 'checkCard',
  balance: 1000,
};
const creditCard = {
  type: 'creditCard',
  limit: 10000,
  payment: 8000,
};
const cash = {
  type: 'cash',
  // money: 1000,
  coin: {
    10000: { amount: 0 },
    5000: { amount: 1 },
    1000: { amount: 1 },
    500: { amount: 1 },
    100: { amount: 2 },
  },
};

/* console 함수 */
const drinkMenu = (i) => {
  if (i) console.log(`===================[ ${i} ]===================`);
  for (let i = 1; i <= Object.keys(drink).length; i++) {
    console.log(
      `[${drink[i].availability ? '구매가능' : '구매불가'}] ${i} - ${
        drink[i].name
      } 가격 : ${drink[i].price}, 재고 : ${drink[i].amount}`
    );
  }
}; // end [ drinkMenu ]

/* 공통 함수 */
const amountCheck = () => {
  for (type in drink) {
    if (drink[type].amount > 0) {
      drink[type].availability = true;
    } else {
      drink[type].availability = false;
    }
  }
}; // end [ amountCheck ]
const comparisonPrice = (money) => {
  // 현금 , 체크카드
  for (type in drink) {
    if (drink[type].availability) {
      if (drink[type].price > money) {
        drink[type].availability = false;
      }
    }
  }
}; // end [ comparisonPrice ]
const choiceDrink = (number) => {
  if (drink[number].availability) {
    return true;
  } else {
    return false;
  }
}; // end [ choiceDrink ]

/* 현금결제 현재 금액 조회 */
const cashInquiry = () => {
  const coin = cash.coin;
  const inCoin = inputCoin.coin;
  const chCoin = changeCoin.coin;
  let resultCoin = 0;
  for (won in coin) {
    inCoin[won].amount = coin[won].amount;
    resultCoin += won * coin[won].amount;
    chCoin[won].amount += coin[won].amount;
    coin[won].amount = 0;
  }
  return resultCoin;
}; // end [ cashInquiry ]

/* 현금결제 예외처리 로직 */
const whetherChange = (money) => {
  const chCoin = changeCoin.coin;
  let won = Object.keys(chCoin);
  won.sort((a, b) => {
    return b - a;
  });

  for (type in drink) {
    if (drink[type].availability) {
      let change = money - drink[type].price;
      let coinCount = [0, 0, 0, 0, 0];
      for (let i = 0; i < won.length; i++) {
        coinCount[i] = parseInt(change / won[i]);
        change -= won[i] * coinCount[i];
      }

      for (let i = 0; i < won.length; i++) {
        if (coinCount[i] > inputCoin.coin[won[i]].amount) {
          drink[type].availability = false;
        }
      }
    }
  }
}; // end [ whetherChange2 ]
/* 현금결제 거스름돈 로직 */
const dropMoneyBack = (change) => {
  const coin = cash.coin;
  const inCoin = inputCoin.coin;
  const chCoin = changeCoin.coin;
  const won = Object.keys(chCoin);
  won.sort((a, b) => {
    return b - a;
  });
  for (let i = 0; i < won.length; i++) {
    let count = parseInt(change / won[i]);
    chCoin[won[i]].amount -= count;
    coin[won[i]].amount += count;
    inCoin[won[i]].amount = 0;
    change -= won[i] * count;
  }
}; // end [ dropMoneyBack ]
const fullRefund = () => {
  const coin = cash.coin;
  const inCoin = inputCoin.coin;
  const chCoin = changeCoin.coin;
  for (won in coin) {
    coin[won].amount = inCoin[won].amount;
    chCoin[won].amount -= inCoin[won].amount;
    inCoin[won].amount = 0;
  }
};

/* 신용카드 결제 로직 */
const limitInquiry = (creditCard, price) => {
  let { limit, payment } = creditCard;
  if (limit >= payment + price) return true;
  else return false;
}; // end [ limitInquiry ]

/* 결제 */
const cashLogic = (cash) => {
  console.log(`================[ 현금결제 ]================`);
  for (let i = 1; i <= 3; i++) {
    let money = cashInquiry();
    console.log('투입 금액 : ', money);
    amountCheck();
    comparisonPrice(money);
    whetherChange(money);
    drinkMenu(i);
    if (choiceDrink(i)) {
      const change = money - drink[i].price;
      drink[i].amount -= 1;
      dropMoneyBack(change);
    } else {
      fullRefund();
    }
  }
  console.log('거스름돈 여부 : ', changeCoin);
}; // end [ cashLogic ]
const checkCardLogic = (checkCard) => {
  console.log(`================[ 체크카드 ]================`);
  for (let i = 1; i <= 3; i++) {
    amountCheck();
    comparisonPrice(checkCard.balance);
    drinkMenu(i);
    console.log(`현재 잔고 : ${checkCard.balance}`);
    if (choiceDrink(i)) {
      console.log(`${drink[i].name} 구매 완료`);
      checkCard.balance -= drink[i].price;
      drink[i].amount -= 1;
    } else {
      console.log(`${drink[i].name} 구매 실패`);
    }
  }
}; // end [ checkCardLogic ]
const creditCardLogic = (creditCard) => {
  console.log(`================[ 신용카드 ]================`);
  console.log(`한도 : ${creditCard.limit}`);
  for (let i = 1; i <= 3; i++) {
    amountCheck();
    drinkMenu(i);
    console.log(`결제 금액 : ${creditCard.payment}`);
    if (choiceDrink(i) && limitInquiry(creditCard, drink[i].price)) {
      console.log(`${drink[i].name} 구매 성공`);
      creditCard.payment += drink[i].price;
      drink[i].amount -= 1;
    } else {
      console.log(`${drink[i].name} 구매 실패`);
    }
  }
}; // end [ creditCardLogic ]

const vendingMachine = (paymentMethod) => {
  switch (paymentMethod.type) {
    case 'cash':
      cashLogic(paymentMethod);
      break;
    case 'checkCard':
      checkCardLogic(paymentMethod);
      break;
    case 'creditCard':
      creditCardLogic(paymentMethod);
      break;
  }
};

const output1 = vendingMachine(cash);
const output2 = vendingMachine(checkCard);
const output3 = vendingMachine(creditCard);

// Closure example - counter
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2

// Practical use - private variables
function bankAccount(initialBalance) {
  let balance = initialBalance;
  
  return {
    deposit: (amount) => balance += amount,
    withdraw: (amount) => balance -= amount,
    checkBalance: () => balance
  };
}

const myAccount = bankAccount(1000);
myAccount.deposit(500);
console.log(myAccount.checkBalance()); // 1500

// Function that returns a function
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Function that takes a function as argument
function repeatOperation(times, operation) {
  for (let i = 0; i < times; i++) {
    operation(i);
  }
}

repeatOperation(3, (i) => console.log(`Iteration ${i}`));

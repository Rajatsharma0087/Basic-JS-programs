const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]

// Filter - keep elements that match condition
const evens = numbers.filter(num => num % 2 === 0);
// [2, 4]

// Reduce - combine into single value
const sum = numbers.reduce((acc, num) => acc + num, 0);
// 15

// Chaining methods
const result = numbers
  .filter(num => num > 2)
  .map(num => num * 3)
  .reduce((acc, num) => acc + num, 0);
// 36

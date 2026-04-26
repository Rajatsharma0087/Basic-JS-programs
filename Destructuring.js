// Object Destructuring
const user = { name: 'Sarah', age: 28, city: 'NYC' };
const { name, age } = user;
console.log(name); // Sarah

// Array Destructuring
const colors = ['red', 'blue', 'green'];
const [first, second] = colors;
console.log(first); // red

// Nested Destructuring
const employee = { 
  id: 101, 
  details: { role: 'Developer', level: 'Senior' } 
};
const { details: { role } } = employee;
console.log(role); // Developer

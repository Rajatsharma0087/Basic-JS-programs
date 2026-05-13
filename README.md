Basic JavaScript Programs:
- Even or Odd
- Factorial
- Reverse String

# 🚀 JavaScript Intermediate Concepts

A comprehensive collection of intermediate JavaScript concepts with practical examples. Perfect for developers looking to level up their JS skills!

## 📚 About This Repository

This repo contains clean, well-documented examples of intermediate JavaScript concepts. Each concept includes:
- Clear explanations
- Practical code examples
- Real-world use cases
- Best practices

## 📖 Table of Contents

1. [Destructuring Assignment](#1-destructuring-assignment)
2. [Array Methods (map, filter, reduce)](#2-array-methods)
3. [Promises & Async/Await](#3-promises--asyncawait)
4. [Closures](#4-closures)
5. [Spread & Rest Operators](#5-spread--rest-operators)
6. [Higher-Order Functions](#6-higher-order-functions)

---

## 1. Destructuring Assignment

Destructuring allows you to extract values from arrays or properties from objects into distinct variables.

```javascript
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

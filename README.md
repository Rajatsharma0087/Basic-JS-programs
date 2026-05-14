# 🚀 JavaScript: Beginner to Intermediate Concepts

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

A comprehensive collection of JavaScript concepts from 
beginner to intermediate level with practical examples.
Perfect for developers looking to level up their JS skills!

---

## 👨‍💻 About This Repository

This repo contains clean, well-documented JavaScript examples.
Each concept includes:
- ✅ Clear explanations
- ✅ Practical code examples  
- ✅ Real-world use cases
- ✅ Best practices
- ✅ Beginner + Intermediate levels

---

## 📖 Table of Contents

### 🟢 Beginner Programs
1. [Even or Odd](#1-even-or-odd)
2. [Factorial](#2-factorial)
3. [Reverse String](#3-reverse-string)

### 🟡 Intermediate Concepts
4. [Destructuring Assignment](#4-destructuring-assignment)
5. [Array Methods](#5-array-methods)
6. [Promises & Async/Await](#6-promises--asyncawait)
7. [Closures](#7-closures)
8. [Spread & Rest Operators](#8-spread--rest-operators)
9. [Higher-Order Functions](#9-higher-order-functions)

---

## 🟢 BEGINNER PROGRAMS

---

## 1. Even or Odd

```javascript
// ✅ Method 1: Basic Function
function isEvenOrOdd(num) {
  if (num % 2 === 0) {
    return `${num} is Even ✅`;
  } else {
    return `${num} is Odd ❌`;
  }
}

// ✅ Method 2: Ternary Operator (Clean Code)
const checkNumber = (num) => 
  num % 2 === 0 ? `${num} is Even` : `${num} is Odd`;

// ✅ Method 3: Arrow Function
const isEven = (num) => num % 2 === 0;

// 🧪 Testing
console.log(isEvenOrOdd(10));  // 10 is Even ✅
console.log(isEvenOrOdd(7));   // 7 is Odd ❌
console.log(checkNumber(4));   // 4 is Even
console.log(isEven(3));        // false

// ✅ Real World Use Case
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const evenNumbers = numbers.filter(num => num % 2 === 0);
const oddNumbers = numbers.filter(num => num % 2 !== 0);

console.log("Even:", evenNumbers); // [2, 4, 6, 8]
console.log("Odd:", oddNumbers);   // [1, 3, 5, 7]

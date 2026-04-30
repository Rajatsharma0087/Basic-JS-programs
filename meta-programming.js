class SymbolExamples {
  
  // Well-known symbols for custom behavior
  static customIterator() {
    class Range {
      constructor(start, end) {
        this.start = start;
        this.end = end;
      }

      // Make it iterable
      [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        return {
          next() {
            if (current <= end) {
              return { value: current++, done: false };
            }
            return { value: undefined, done: true };
          }
        };
      }
    }

    const range = new Range(1, 5);
    console.log([...range]);         // [1, 2, 3, 4, 5]
    console.log(Array.from(range));  // [1, 2, 3, 4, 5]
    for (const n of range) console.log(n);
  }

  // Custom type checking with Symbol.hasInstance
  static customInstanceOf() {
    class EvenNumber {
      static [Symbol.hasInstance](instance) {
        return typeof instance === 'number' && instance % 2 === 0;
      }
    }

    console.log(4 instanceof EvenNumber);  // true
    console.log(3 instanceof EvenNumber);  // false
    console.log(6 instanceof EvenNumber);  // true
  }

  // Custom primitive conversion
  static customPrimitive() {
    class Money {
      constructor(amount, currency) {
        this.amount = amount;
        this.currency = currency;
      }

      [Symbol.toPrimitive](hint) {
        if (hint === 'number') return this.amount;
        if (hint === 'string') return `${this.amount} ${this.currency}`;
        return this.amount; // default
      }
    }

    const price = new Money(10, 'USD');
    console.log(+price);      // 10 (number hint)
    console.log(`${price}`);  // "10 USD" (string hint)
    console.log(price + 5);   // 15 (default hint)
  }
}

// ========== REFLECT ==========
class ReflectExamples {

  // Reflect vs direct operations
  static comparison() {
    const obj = { x: 1, y: 2 };

    // Direct vs Reflect
    console.log(obj.x);                    // 1
    console.log(Reflect.get(obj, 'x'));    // 1

    obj.z = 3;
    Reflect.set(obj, 'w', 4);

    delete obj.x;
    Reflect.deleteProperty(obj, 'y');

    console.log(obj); // { z: 3, w: 4 }
  }

  // Forwarding with Reflect in Proxy
  static proxyWithReflect() {
    const handler = {
      get(target, prop, receiver) {
        console.log(`GET: ${prop}`);
        return Reflect.get(target, prop, receiver); // Forward correctly
      },
      set(target, prop, value, receiver) {
        console.log(`SET: ${prop} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
      },
      has(target, prop) {
        console.log(`HAS: ${prop}`);
        return Reflect.has(target, prop);
      },
      deleteProperty(target, prop) {
        console.log(`DELETE: ${prop}`);
        return Reflect.deleteProperty(target, prop);
      }
    };

    const proxy = new Proxy({ name: 'John' }, handler);
    proxy.age = 25;
    console.log(proxy.name);
    console.log('age' in proxy);
  }
}

// ========== DECORATORS (Manual Implementation) ==========
function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

function log(target, name, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`Calling ${name} with:`, args);
    const result = original.apply(this, args);
    console.log(`${name} returned:`, result);
    return result;
  };
  return descriptor;
}

function memoize(target, name, descriptor) {
  const original = descriptor.value;
  const cache = new Map();
  
  descriptor.value = function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };
  return descriptor;
}

// Class decorator
function singleton(constructor) {
  let instance;
  return class extends constructor {
    constructor(...args) {
      if (instance) return instance;
      super(...args);
      instance = this;
    }
  };
}

// Run examples
SymbolExamples.customIterator();
SymbolExamples.customInstanceOf();
SymbolExamples.customPrimitive();
ReflectExamples.proxyWithReflect();

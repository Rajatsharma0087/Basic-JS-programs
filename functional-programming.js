const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

// Advanced curry with placeholder support
const __ = Symbol('placeholder');

const curryWithPlaceholder = (fn) => {
  const arity = fn.length;
  
  return function curried(...args) {
    const hasPlaceholder = args.includes(__);
    
    if (!hasPlaceholder && args.length >= arity) {
      return fn(...args);
    }
    
    return (...newArgs) => {
      const merged = args.map(arg => 
        arg === __ && newArgs.length ? newArgs.shift() : arg
      );
      return curried(...merged, ...newArgs);
    };
  };
};

// ========== COMPOSE & PIPE ==========
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Async pipe
const pipeAsync = (...fns) => x => 
  fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(x));

// ========== MONAD PATTERN ==========
class Maybe {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  static empty() {
    return new Maybe(null);
  }

  isNothing() {
    return this.#value === null || this.#value === undefined;
  }

  map(fn) {
    return this.isNothing() ? Maybe.empty() : Maybe.of(fn(this.#value));
  }

  flatMap(fn) {
    return this.isNothing() ? Maybe.empty() : fn(this.#value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.#value;
  }

  filter(predicate) {
    if (this.isNothing()) return Maybe.empty();
    return predicate(this.#value) ? this : Maybe.empty();
  }
}

// Either Monad (for error handling)
class Either {
  constructor(value) {
    this.value = value;
  }

  static right(value) {
    return new Right(value);
  }

  static left(value) {
    return new Left(value);
  }

  static tryCatch(fn) {
    try {
      return Either.right(fn());
    } catch (e) {
      return Either.left(e.message);
    }
  }
}

class Right extends Either {
  map(fn) { return Either.right(fn(this.value)); }
  flatMap(fn) { return fn(this.value); }
  getOrElse(_) { return this.value; }
  fold(_, right) { return right(this.value); }
}

class Left extends Either {
  map(_) { return this; }
  flatMap(_) { return this; }
  getOrElse(defaultValue) { return defaultValue; }
  fold(left, _) { return left(this.value); }
}

// ========== TRANSDUCER ==========
const transduce = {
  map: (fn) => (reducer) => (acc, item) => reducer(acc, fn(item)),
  filter: (pred) => (reducer) => (acc, item) => 
    pred(item) ? reducer(acc, item) : acc,
  take: (n) => (reducer) => {
    let count = 0;
    return (acc, item) => {
      if (count++ < n) return reducer(acc, item);
      return acc;
    };
  },
  
  compose: (...transducers) => compose(...transducers),
  
  run: (xf, reducer, init, coll) => 
    coll.reduce(xf(reducer), init)
};

// Usage Examples
const double = x => x * 2;
const isEven = x => x % 2 === 0;
const add = (acc, x) => [...acc, x];

// Without transducer - creates 3 intermediate arrays ❌
const withoutTransducer = [1,2,3,4,5,6,7,8,9,10]
  .filter(isEven)     // [2,4,6,8,10]
  .map(double)        // [4,8,12,16,20]
  .slice(0, 3);       // [4,8,12]

// With transducer - single pass, no intermediate arrays ✅
const xf = transduce.compose(
  transduce.filter(isEven),
  transduce.map(double),
  transduce.take(3)
);

const withTransducer = transduce.run(xf, add, [], [1,2,3,4,5,6,7,8,9,10]);
console.log(withTransducer); // [4, 8, 12]

// Practical Maybe Example
function getUserCity(userId) {
  const users = {
    1: { name: 'John', address: { city: 'New York' } },
    2: { name: 'Jane', address: null }
  };

  return Maybe.of(users[userId])
    .map(user => user.address)
    .map(address => address.city)
    .getOrElse('City not found');
}

console.log(getUserCity(1)); // New York
console.log(getUserCity(2)); // City not found
console.log(getUserCity(3)); // City not found

// Either for error handling
const parseJSON = (str) => Either.tryCatch(() => JSON.parse(str));

const result = parseJSON('{"name": "John"}')
  .map(data => data.name)
  .map(name => name.toUpperCase())
  .fold(
    err => `Error: ${err}`,
    name => `Hello, ${name}!`
  );

console.log(result); // Hello, JOHN!

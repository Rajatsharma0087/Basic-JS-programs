class MyPromise {
  #state = 'pending';
  #value = undefined;
  #handlers = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.#state !== 'pending') return;
      this.#state = 'fulfilled';
      this.#value = value;
      this.#handlers.forEach(h => h.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.#state !== 'pending') return;
      this.#state = 'rejected';
      this.#value = reason;
      this.#handlers.forEach(h => h.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = {
        onFulfilled: (value) => {
          try {
            const result = onFulfilled ? onFulfilled(value) : value;
            resolve(result);
          } catch (e) {
            reject(e);
          }
        },
        onRejected: (reason) => {
          try {
            if (onRejected) {
              resolve(onRejected(reason));
            } else {
              reject(reason);
            }
          } catch (e) {
            reject(e);
          }
        }
      };

      if (this.#state === 'fulfilled') {
        queueMicrotask(() => handle.onFulfilled(this.#value));
      } else if (this.#state === 'rejected') {
        queueMicrotask(() => handle.onRejected(this.#value));
      } else {
        this.#handlers.push(handle);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  }

  static resolve(value) {
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  // Promise.all - fails if ANY fails
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then(value => {
            results[index] = value;
            if (++completed === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }

  // Promise.allSettled - waits for ALL to settle
  static allSettled(promises) {
    return new MyPromise(resolve => {
      const results = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then(value => {
            results[index] = { status: 'fulfilled', value };
          })
          .catch(reason => {
            results[index] = { status: 'rejected', reason };
          })
          .finally(() => {
            if (++completed === promises.length) resolve(results);
          });
      });
    });
  }

  // Promise.race - first one wins
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve).catch(reject);
      });
    });
  }

  // Promise.any - first SUCCESS wins
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const errors = [];
      let rejected = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then(resolve)
          .catch(error => {
            errors[index] = error;
            if (++rejected === promises.length) {
              reject(new AggregateError(errors, 'All promises rejected'));
            }
          });
      });
    });
  }
}

// Advanced Promise Patterns
class PromisePatterns {

  // Retry with exponential backoff
  static async retry(fn, maxAttempts = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Timeout wrapper
  static withTimeout(promise, timeoutMs) {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout!')), timeoutMs);
    });
    return Promise.race([promise, timeout]);
  }

  // Throttle Promise (limit concurrent)
  static async throttleAll(promises, concurrency = 3) {
    const results = [];
    const executing = new Set();

    for (const promise of promises) {
      const p = Promise.resolve(promise).then(result => {
        executing.delete(p);
        return result;
      });

      executing.add(p);
      results.push(p);

      if (executing.size >= concurrency) {
        await Promise.race(executing);
      }
    }

    return Promise.all(results);
  }

  // Memoize async function
  static memoizeAsync(fn) {
    const cache = new Map();
    
    return async function(...args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        console.log('Cache hit!');
        return cache.get(key);
      }
      
      const result = await fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }
}

// Test
async function testPromises() {
  // Test retry
  let attempts = 0;
  const result = await PromisePatterns.retry(async () => {
    attempts++;
    if (attempts < 3) throw new Error('Not yet');
    return 'Success!';
  });
  console.log(result, `(took ${attempts} attempts)`);

  // Test throttle
  const mockFetch = (id) => new Promise(resolve => {
    setTimeout(() => resolve(`Data ${id}`), Math.random() * 1000);
  });

  const promises = Array.from({ length: 10 }, (_, i) => mockFetch(i));
  const results = await PromisePatterns.throttleAll(promises, 3);
  console.log('Throttled results:', results);
}

testPromises();

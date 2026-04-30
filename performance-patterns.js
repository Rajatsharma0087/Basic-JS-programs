class ObjectPool {
  #pool = [];
  #factory;
  #reset;
  #maxSize;

  constructor(factory, reset, maxSize = 100) {
    this.#factory = factory;
    this.#reset = reset;
    this.#maxSize = maxSize;
  }

  acquire() {
    return this.#pool.length > 0
      ? this.#pool.pop()
      : this.#factory();
  }

  release(obj) {
    if (this.#pool.length < this.#maxSize) {
      this.#reset(obj);
      this.#pool.push(obj);
    }
  }

  get size() { return this.#pool.length; }
}

// Example: Particle system with pooling
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, active: false }),
  (p) => { p.x = 0; p.y = 0; p.vx = 0; p.vy = 0; p.life = 0; p.active = false; }
);

class ParticleSystem {
  #particles = [];

  emit(x, y) {
    const particle = particlePool.acquire();
    particle.x = x;
    particle.y = y;
    particle.vx = (Math.random() - 0.5) * 5;
    particle.vy = (Math.random() - 0.5) * 5;
    particle.life = 100;
    particle.active = true;
    this.#particles.push(particle);
  }

  update() {
    this.#particles = this.#particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0) {
        particlePool.release(p); // Return to pool!
        return false;
      }
      return true;
    });
  }
}

// ========== VIRTUAL LIST (for 1M+ items) ==========
class VirtualList {
  #itemHeight;
  #visibleCount;
  #scrollTop = 0;

  constructor(container, itemHeight, items) {
    this.container = container;
    this.#itemHeight = itemHeight;
    this.items = items;
    this.#visibleCount = Math.ceil(
      window.innerHeight / itemHeight
    ) + 2; // Buffer
  }

  getVisibleRange() {
    const startIndex = Math.floor(this.#scrollTop / this.#itemHeight);
    const endIndex = Math.min(
      startIndex + this.#visibleCount,
      this.items.length
    );
    return { startIndex, endIndex };
  }

  render() {
    const { startIndex, endIndex } = this.getVisibleRange();
    const totalHeight = this.items.length * this.#itemHeight;
    const offsetY = startIndex * this.#itemHeight;

    // Only render visible items!
    const visibleItems = this.items.slice(startIndex, endIndex);
    return { visibleItems, totalHeight, offsetY };
  }

  handleScroll(scrollTop) {
    this.#scrollTop = scrollTop;
    return this.render();
  }
}

// ========== LAZY EVALUATION ==========
class Lazy {
  #fn;
  #value;
  #evaluated = false;

  constructor(fn) {
    this.#fn = fn;
  }

  get value() {
    if (!this.#evaluated) {
      this.#value = this.#fn();
      this.#evaluated = true;
      console.log('Computed!');
    }
    return this.#value;
  }

  map(fn) {
    return new Lazy(() => fn(this.value));
  }
}

// ========== DEBOUNCE & THROTTLE ==========
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer;
  let lastResult;

  function debounced(...args) {
    const shouldCallLeading = leading && !timer;
    
    clearTimeout(timer);
    
    timer = setTimeout(() => {
      timer = null;
      if (trailing) {
        lastResult = fn.apply(this, args);
      }
    }, delay);

    if (shouldCallLeading) {
      lastResult = fn.apply(this, args);
    }

    return lastResult;
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  debounced.flush = function(...args) {
    debounced.cancel();
    return fn.apply(this, args);
  };

  return debounced;
}

function throttle(fn, limit) {
  let inThrottle;
  let lastResult;

  return function throttled(...args) {
    if (!inThrottle) {
      lastResult = fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    return lastResult;
  };
}

// Usage
const expensiveSearch = debounce((query) => {
  console.log(`Searching: ${query}`);
}, 300);

const handleScroll = throttle(() => {
  console.log('Scroll handled');
}, 100);

// Test
expensiveSearch('J');
expensiveSearch('Jo');
expensiveSearch('John'); // Only this fires!

// Lazy example
const expensiveCalc = new Lazy(() => {
  console.log('Running expensive calculation...');
  return Array.from({ length: 1000000 }, (_, i) => i).reduce((a, b) => a + b, 0);
});

// Not computed yet
console.log('Created lazy value');
// Now it computes
console.log(expensiveCalc.value);
// Uses cache
console.log(expensiveCalc.value);

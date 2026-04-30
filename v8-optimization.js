class V8Optimization {

  // ✅ GOOD: Same shape objects = V8 creates Hidden Class
  goodPattern() {
    console.log('=== HIDDEN CLASSES (GOOD) ===');

    function Point(x, y) {
      this.x = x;  // Always same order
      this.y = y;  // Always same order
    }

    const p1 = new Point(1, 2);
    const p2 = new Point(3, 4);
    // V8 reuses same Hidden Class = FAST ✅
    
    return { p1, p2 };
  }

  // ❌ BAD: Different property order = different Hidden Classes
  badPattern() {
    console.log('=== HIDDEN CLASSES (BAD) ===');

    const obj1 = {};
    obj1.x = 1;
    obj1.y = 2;
    // Hidden Class: C0 -> C1(x) -> C2(x,y)

    const obj2 = {};
    obj2.y = 2;  // Different order!
    obj2.x = 1;
    // Hidden Class: C0 -> C3(y) -> C4(y,x)
    // V8 creates DIFFERENT hidden classes = SLOW ❌
  }

  // Inline Cache optimization
  demonstrateInlineCache() {
    console.log('=== INLINE CACHE ===');

    class Animal {
      constructor(name) {
        this.name = name;
      }
      
      speak() {
        return `${this.name} makes a sound`;
      }
    }

    const animals = Array.from(
      { length: 1000 }, 
      (_, i) => new Animal(`Animal${i}`)
    );

    // V8 caches the property lookup for 'speak'
    // Same hidden class = Monomorphic IC = FASTEST
    console.time('monomorphic');
    animals.forEach(a => a.speak());
    console.timeEnd('monomorphic');
  }

  // Deoptimization example
  demonstrateDeopt() {
    console.log('=== DEOPTIMIZATION ===');

    function add(a, b) {
      return a + b;
    }

    // V8 optimizes for numbers
    for (let i = 0; i < 10000; i++) {
      add(1, 2);  // Optimized for int
    }

    // Now passing string = DEOPTIMIZATION
    add('hello', 'world');
    // V8 must deoptimize and recompile function
  }
}

const v8 = new V8Optimization();
v8.goodPattern();
v8.badPattern();
v8.demonstrateInlineCache();
v8.demonstrateDeopt();

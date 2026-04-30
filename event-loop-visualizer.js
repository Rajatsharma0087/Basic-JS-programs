class EventLoopVisualizer {
  constructor() {
    this.callStack = [];
    this.callbackQueue = [];
    this.microtaskQueue = [];
    this.webAPIs = [];
    this.logs = [];
  }

  log(message, type = 'info') {
    const entry = {
      message,
      type,
      timestamp: Date.now(),
      callStackSnapshot: [...this.callStack],
    };
    this.logs.push(entry);
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  // Demonstrates Call Stack
  demonstrateCallStack() {
    console.log('\n=== CALL STACK DEMO ===');

    function third() {
      console.log('Third function - TOP of stack');
      // Stack: [main, first, second, third]
    }

    function second() {
      console.log('Second function');
      third();
      // Stack: [main, first, second]
    }

    function first() {
      console.log('First function');
      second();
      // Stack: [main, first]
    }

    first();
  }

  // Demonstrates Microtask vs Macrotask
  demonstrateMicrotaskVsMacrotask() {
    console.log('\n=== MICROTASK vs MACROTASK ===');
    console.log('1. Script start');            // Sync

    setTimeout(() => {
      console.log('5. setTimeout - MacroTask'); // Macrotask Queue
    }, 0);

    Promise.resolve()
      .then(() => {
        console.log('3. Promise 1 - MicroTask'); // Microtask Queue
      })
      .then(() => {
        console.log('4. Promise 2 - MicroTask'); // Microtask Queue
      });

    queueMicrotask(() => {
      console.log('2.5 queueMicrotask');        // Microtask Queue
    });

    console.log('2. Script end');               // Sync

    // OUTPUT ORDER:
    // 1. Script start
    // 2. Script end
    // 2.5 queueMicrotask
    // 3. Promise 1 - MicroTask
    // 4. Promise 2 - MicroTask
    // 5. setTimeout - MacroTask
  }

  // Demonstrates Starvation
  demonstrateStarvation() {
    console.log('\n=== STARVATION DEMO ===');
    // If microtasks keep adding microtasks,
    // macrotasks NEVER run (Starvation)

    let count = 0;

    function keepAddingMicrotasks() {
      if (count < 5) {
        count++;
        console.log(`Microtask ${count}`);
        Promise.resolve().then(keepAddingMicrotasks);
      }
    }

    Promise.resolve().then(keepAddingMicrotasks);

    setTimeout(() => {
      console.log('This runs AFTER all microtasks');
    }, 0);
  }
}

const visualizer = new EventLoopVisualizer();
visualizer.demonstrateCallStack();
visualizer.demonstrateMicrotaskVsMacrotask();
visualizer.demonstrateStarvation();

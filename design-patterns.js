class EventEmitter {
  #events = new Map();
  #onceMap = new WeakMap();

  on(event, listener) {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Set());
    }
    this.#events.get(event).add(listener);
    return () => this.off(event, listener); // Return unsubscribe fn
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.#onceMap.set(listener, wrapper);
    return this.on(event, wrapper);
  }

  off(event, listener) {
    const listeners = this.#events.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  emit(event, ...args) {
    const listeners = this.#events.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  removeAllListeners(event) {
    if (event) {
      this.#events.delete(event);
    } else {
      this.#events.clear();
    }
  }
}

// ========== PROXY PATTERN ==========
class ProxyPatterns {

  // Validation Proxy
  static createValidated(target, validators) {
    return new Proxy(target, {
      set(obj, prop, value) {
        if (validators[prop]) {
          const error = validators[prop](value);
          if (error) throw new TypeError(`${prop}: ${error}`);
        }
        obj[prop] = value;
        return true;
      }
    });
  }

  // Observable Proxy
  static createObservable(target, onChange) {
    return new Proxy(target, {
      set(obj, prop, value) {
        const oldValue = obj[prop];
        obj[prop] = value;
        onChange({ prop, oldValue, newValue: value });
        return true;
      },
      deleteProperty(obj, prop) {
        const oldValue = obj[prop];
        delete obj[prop];
        onChange({ prop, oldValue, newValue: undefined, deleted: true });
        return true;
      }
    });
  }

  // Lazy Loading Proxy
  static createLazy(factory) {
    let instance = null;
    return new Proxy({}, {
      get(_, prop) {
        if (!instance) {
          console.log('Creating instance lazily...');
          instance = factory();
        }
        return instance[prop];
      }
    });
  }

  // Cache Proxy
  static createCached(target) {
    const cache = new Map();
    return new Proxy(target, {
      apply(fn, thisArg, args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(thisArg, args);
        cache.set(key, result);
        return result;
      }
    });
  }
}

// ========== COMMAND PATTERN ==========
class CommandManager {
  #history = [];
  #redoStack = [];

  execute(command) {
    command.execute();
    this.#history.push(command);
    this.#redoStack = []; // Clear redo on new command
  }

  undo() {
    const command = this.#history.pop();
    if (command) {
      command.undo();
      this.#redoStack.push(command);
    }
  }

  redo() {
    const command = this.#redoStack.pop();
    if (command) {
      command.execute();
      this.#history.push(command);
    }
  }
}

// Text Editor Commands
class TextEditor {
  #content = '';
  #commandManager = new CommandManager();

  insert(text, position) {
    this.#commandManager.execute({
      execute: () => {
        this.#content = 
          this.#content.slice(0, position) + 
          text + 
          this.#content.slice(position);
      },
      undo: () => {
        this.#content = 
          this.#content.slice(0, position) + 
          this.#content.slice(position + text.length);
      }
    });
  }

  undo() { this.#commandManager.undo(); }
  redo() { this.#commandManager.redo(); }
  getContent() { return this.#content; }
}

// ========== STRATEGY PATTERN ==========
class Sorter {
  #strategy;

  constructor(strategy) {
    this.#strategy = strategy;
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  sort(data) {
    return this.#strategy.sort([...data]);
  }
}

const strategies = {
  bubble: {
    sort(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
      return arr;
    }
  },
  quick: {
    sort(arr) {
      if (arr.length <= 1) return arr;
      const pivot = arr[Math.floor(arr.length / 2)];
      const left = arr.filter(x => x < pivot);
      const middle = arr.filter(x => x === pivot);
      const right = arr.filter(x => x > pivot);
      return [...this.sort(left), ...middle, ...this.sort(right)];
    }
  }
};

// Demo
const user = ProxyPatterns.createValidated(
  { name: '', age: 0 },
  {
    name: (v) => typeof v !== 'string' ? 'Must be string' : null,
    age: (v) => v < 0 || v > 150 ? 'Invalid age' : null,
  }
);

user.name = 'John';
user.age = 25;
console.log(user);

const editor = new TextEditor();
editor.insert('Hello', 0);
editor.insert(' World', 5);
console.log(editor.getContent()); // Hello World
editor.undo();
console.log(editor.getContent()); // Hello

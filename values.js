const product = {
  name: 'Laptop',
  price: 999,
  inStock: true
};

// Get all keys
const keys = Object.keys(product);
// ['name', 'price', 'inStock']

// Get all values
const values = Object.values(product);
// ['Laptop', 999, true]

// Get key-value pairs
const entries = Object.entries(product);
// [['name', 'Laptop'], ['price', 999], ['inStock', true]]

// Convert back to object
const obj = Object.fromEntries(entries);

// Practical example: filtering object properties
const numericProps = Object.entries(product)
  .filter(([key, value]) => typeof value === 'number')
  .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
// { price: 999 }

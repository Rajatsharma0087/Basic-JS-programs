// Promise example
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId) {
        resolve({ id: userId, name: 'John Doe' });
      } else {
        reject('User ID required');
      }
    }, 1000);
  });
}

// Using async/await
async function getUser() {
  try {
    const user = await fetchUserData(123);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}

// Promise.all - run multiple promises
async function getAllData() {
  const [users, posts] = await Promise.all([
    fetchUserData(1),
    fetchUserData(2)
  ]);
  return { users, posts };
}

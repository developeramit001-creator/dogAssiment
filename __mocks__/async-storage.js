const storage = {};

const AsyncStorage = {
  getItem: jest.fn(async (key) => {
    return Object.prototype.hasOwnProperty.call(storage, key)
      ? storage[key]
      : null;
  }),

  setItem: jest.fn(async (key, value) => {
    storage[key] = value;
  }),

  removeItem: jest.fn(async (key) => {
    delete storage[key];
  }),

  clear: jest.fn(async () => {
    Object.keys(storage).forEach((key) => {
      delete storage[key];
    });
  }),

  getAllKeys: jest.fn(async () => {
    return Object.keys(storage);
  }),

  multiGet: jest.fn(async (keys) => {
    return keys.map((key) => [
      key,
      Object.prototype.hasOwnProperty.call(storage, key)
        ? storage[key]
        : null,
    ]);
  }),

  multiSet: jest.fn(async (pairs) => {
    pairs.forEach(([key, value]) => {
      storage[key] = value;
    });
  }),

  multiRemove: jest.fn(async (keys) => {
    keys.forEach((key) => {
      delete storage[key];
    });
  }),
};

module.exports = AsyncStorage;
module.exports.default = AsyncStorage;
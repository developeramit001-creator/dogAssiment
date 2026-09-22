const mockTransaction = {
  executeSql: jest.fn((query, params = [], successCallback) => {
    const resultSet = {
      rows: {
        length: 0,
        item: jest.fn(() => null),
        raw: jest.fn(() => []),
      },
      rowsAffected: 0,
      insertId: undefined,
    };

    if (typeof successCallback === 'function') {
      successCallback(mockTransaction, resultSet);
    }

    return Promise.resolve(resultSet);
  }),
};

const mockDatabase = {
  transaction: jest.fn((callback, errorCallback, successCallback) => {
    try {
      if (typeof callback === 'function') {
        callback(mockTransaction);
      }

      if (typeof successCallback === 'function') {
        successCallback();
      }
    } catch (error) {
      if (typeof errorCallback === 'function') {
        errorCallback(error);
      }
    }
  }),

  readTransaction: jest.fn(),

  executeSql: jest.fn(() => Promise.resolve([])),

  close: jest.fn(),

  changePassword: jest.fn(),
};

const SQLite = {
  enablePromise: jest.fn(),

  openDatabase: jest.fn(() => mockDatabase),

  deleteDatabase: jest.fn(() => Promise.resolve()),

  DEBUG: jest.fn(),
};

module.exports = SQLite;
module.exports.default = SQLite;
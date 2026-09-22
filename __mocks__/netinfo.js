const netInfoState = {
  type: 'wifi',
  isConnected: true,
  isInternetReachable: true,
  details: {},
};

const NetInfo = {
  fetch: jest.fn(async () => netInfoState),

  refresh: jest.fn(async () => netInfoState),

  addEventListener: jest.fn((listener) => {
    if (typeof listener === 'function') {
      listener(netInfoState);
    }

    return jest.fn();
  }),

  configure: jest.fn(),
};

module.exports = NetInfo;
module.exports.default = NetInfo;
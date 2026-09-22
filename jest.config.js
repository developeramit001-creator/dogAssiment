module.exports = {
  preset: '@react-native/jest-preset',

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        '@react-navigation',
        '@reduxjs',
        'react-native',
        'react-native-safe-area-context',
        'react-native-screens',
        'react-redux',
        'redux',
        'immer',
      ].join('|') +
      ')/)',
  ],

  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/__mocks__/lucide-react-native.js',

    '^@react-native-community/netinfo$':
      '<rootDir>/__mocks__/netinfo.js',

    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.js',

    '^react-native-fs$':
      '<rootDir>/__mocks__/react-native-fs.js',

    '^react-native-sqlite-storage$':
      '<rootDir>/__mocks__/react-native-sqlite-storage.js',
  },
};
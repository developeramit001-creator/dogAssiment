const RNFS = {
  CachesDirectoryPath: '/tmp',

  DocumentDirectoryPath: '/tmp',

  TemporaryDirectoryPath: '/tmp',

  LibraryDirectoryPath: '/tmp',

  MainBundlePath: '/tmp',

  ExternalCachesDirectoryPath: '/tmp',

  ExternalDirectoryPath: '/tmp',

  exists: jest.fn(async () => false),

  mkdir: jest.fn(async () => undefined),

  unlink: jest.fn(async () => undefined),

  readFile: jest.fn(async () => ''),

  writeFile: jest.fn(async () => undefined),

  appendFile: jest.fn(async () => undefined),

  stat: jest.fn(async () => ({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mtime: new Date(),
    ctime: new Date(),
    path: '/tmp',
  })),

  readDir: jest.fn(async () => []),

  downloadFile: jest.fn(() => ({
    promise: Promise.resolve({
      statusCode: 200,
      bytesWritten: 0,
    }),
    jobId: 1,
  })),

  stopDownload: jest.fn(),

  copyFile: jest.fn(async () => undefined),

  moveFile: jest.fn(async () => undefined),
};

module.exports = RNFS;
module.exports.default = RNFS;
const React = require('react');
const { View } = require('react-native');

const createIcon = () => {
  return React.forwardRef((props, ref) =>
    React.createElement(View, {
      ...props,
      ref,
      testID: props.testID || 'mock-icon',
    })
  );
};

const icons = [
  'Check',
  'ChevronLeft',
  'ChevronRight',
  'Search',
  'Heart',
  'Home',
  'Settings',
  'Filter',
  'ArrowLeft',
  'ArrowRight',
  'X',
  'Menu',
  'RefreshCw',
  'WifiOff',
  'AlertCircle',
  'Info',
];

const mockIcons = {};

icons.forEach((iconName) => {
  mockIcons[iconName] = createIcon();
});

module.exports = mockIcons;
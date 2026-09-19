import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';
import { Bootstrap } from './src/store/Bootstrap';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.root}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

          <Bootstrap />

          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});


import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export default function ShimmerPlaceholder({
  width = '100%',
  height = 20,
  borderRadius = 12,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const x = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [x]);

  // FIX: Variable name is translateX
  const translateX = x.interpolate({
    inputRange: [-1, 1],
    outputRange: [-260, 260],
  });

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ translateX: translateX }],
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#E9DED5',
  },

  glow: {
    width: '40%',
    height: '100%',
    backgroundColor: '#FFF9F3',
    opacity: 0.7,
  },
});

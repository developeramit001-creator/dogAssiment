import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Card } from '../components/UI';
import { clearAll } from '../database';
import { clearCache } from '../store/cacheSlice';
import { useAppDispatch } from '../store/hooks';
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const clear = () =>
    Alert.alert(
      'Clear offline cache?',
      'This removes the local breed and group database. You can sync it again when online.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            dispatch(clearCache());
          },
        },
      ],
    );
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Settings</Text>
      <Card>
        <Text style={styles.cardTitle}>PawBuddy</Text>
        <Text style={styles.muted}>
          Production-grade Dog Breed Explorer for the Tripare AI React Native
          assignment.
        </Text>
        <View style={styles.row}>
          <Text style={styles.muted}>Framework</Text>
          <Text style={styles.value}>React Native CLI</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.muted}>Persistence</Text>
          <Text style={styles.value}>SQLite</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.muted}>API/cache</Text>
          <Text style={styles.value}>RTK Query</Text>
        </View>
      </Card>
      <Pressable onPress={clear} style={styles.danger}>
        <Text style={styles.dangerText}>Clear offline cache</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, padding: 18 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  muted: { color: colors.muted, lineHeight: 21, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  value: { fontWeight: '900', color: colors.text },
  danger: {
    marginTop: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: { color: colors.danger, fontWeight: '900' },
});

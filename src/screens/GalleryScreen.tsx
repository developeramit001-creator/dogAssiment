import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { selectAllBreeds } from '../store/cacheSlice';
import { CachedImage } from '../components/CachedImage';
import { Icon } from '../components/Icon';
const W = Dimensions.get('window').width;
type P = NativeStackScreenProps<RootStackParamList, 'Gallery'>;
export default function GalleryScreen({ route, navigation }: P) {
  const insets = useSafeAreaInsets();
  const breed = useAppSelector(selectAllBreeds).find(
    b => b.id === route.params.id,
  );
  const [index, setIndex] = useState(0);
  const images = (breed?.attributes.images || []).slice(0, 9);
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Icon name="back" size={32} />
      </Pressable>
      <Text style={styles.title}>{breed?.attributes.name || 'Gallery'}</Text>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={x => x.id}
        onMomentumScrollEnd={e =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / W))
        }
        renderItem={({ item }) => (
          <View style={{ width: W, alignItems: 'center' }}>
            <CachedImage
              uri={item.large || item.medium || item.url}
              style={styles.image}
            />
            <View style={styles.caption}>
              <Text style={styles.author}>
                {item.attribution?.author || 'Author not provided'}
              </Text>
              <Text style={styles.license}>
                {item.attribution?.license || 'License not provided'}
              </Text>
              <Text style={styles.source}>
                {item.attribution?.source || 'Source not provided'}
              </Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.counter}>
        {images.length ? index + 1 : 0} / {images.length}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: {
    position: 'absolute',
    zIndex: 3,
    left: 16,
    top: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    padding: 14,
  },
  image: {
    width: W - 28,
    height: W - 28,
    borderRadius: 24,
    backgroundColor: colors.cream,
    marginTop: 20,
  },
  caption: {
    width: W - 42,
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  author: { fontWeight: '900', color: colors.text },
  license: { color: colors.muted, marginTop: 3 },
  source: { color: colors.sage, marginTop: 3, fontWeight: '700' },
  counter: {
    textAlign: 'center',
    color: colors.muted,
    fontWeight: '800',
    padding: 12,
  },
});

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllGroups } from '../store/cacheSlice';
import { setFilters } from '../store/appSlice';
import { FilterState } from '../types/dog';
import { Button } from '../components/UI';
import { Icon } from '../components/Icon';
type P = NativeStackScreenProps<RootStackParamList, 'Filter'>;
const sizes = ['Small', 'Medium', 'Large', 'Giant'];
const coats = ['short', 'medium', 'long', 'wire'];
const traits = [
  ['good_with_children', 'Good with children'],
  ['good_with_dogs', 'Good with dogs'],
  ['good_with_strangers', 'Good with strangers'],
  ['trainability', 'Trainability'],
  ['apartment_friendly', 'Apartment friendly'],
];
export default function FilterScreen({ navigation }: P) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.app.filters);
  const groups = useAppSelector(selectAllGroups);
  const [f, setF] = useState<FilterState>({
    ...current,
    groups: [...current.groups],
    sizes: [...current.sizes],
    coats: [...current.coats],
  });
  const toggleArr = (key: 'groups' | 'sizes' | 'coats', v: string) =>
    setF(x => ({
      ...x,
      [key]: x[key].includes(v) ? x[key].filter(y => y !== v) : [...x[key], v],
    }));
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="back" size={32} />
        </Pressable>
        <Text style={styles.title}>Filters</Text>
        <Pressable
          onPress={() =>
            setF({
              groups: [],
              sizes: [],
              coats: [],
              hypoallergenic: null,
              traitKey: null,
              traitMin: 4,
            })
          }
        >
          <Text style={styles.reset}>Reset</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Label text="Breed group" />
        <Wrap>
          {groups.map(g => (
            <Chip
              key={g.id}
              text={g.attributes.name}
              selected={f.groups.includes(g.attributes.name)}
              onPress={() => toggleArr('groups', g.attributes.name)}
            />
          ))}
        </Wrap>
        <Label text="Size band" />
        <Wrap>
          {sizes.map(v => (
            <Chip
              key={v}
              text={v}
              selected={f.sizes.includes(v)}
              onPress={() => toggleArr('sizes', v)}
            />
          ))}
        </Wrap>
        <Label text="Coat length" />
        <Wrap>
          {coats.map(v => (
            <Chip
              key={v}
              text={v}
              selected={f.coats.includes(v)}
              onPress={() => toggleArr('coats', v)}
            />
          ))}
        </Wrap>
        <Label text="Hypoallergenic" />
        <Wrap>
          <Chip
            text="Yes"
            selected={f.hypoallergenic === true}
            onPress={() =>
              setF(x => ({
                ...x,
                hypoallergenic: x.hypoallergenic === true ? null : true,
              }))
            }
          />
          <Chip
            text="No"
            selected={f.hypoallergenic === false}
            onPress={() =>
              setF(x => ({
                ...x,
                hypoallergenic: x.hypoallergenic === false ? null : false,
              }))
            }
          />
        </Wrap>
        <Label text="Trait threshold · 4+" />
        <Wrap>
          {traits.map(([key, label]) => (
            <Chip
              key={key}
              text={label}
              selected={f.traitKey === key}
              onPress={() =>
                setF(x => ({ ...x, traitKey: x.traitKey === key ? null : key }))
              }
            />
          ))}
        </Wrap>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          title="Apply filters"
          onPress={() => {
            dispatch(setFilters(f));
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}
function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}
function Wrap({ children }: { children: React.ReactNode }) {
  return <View style={styles.wrap}>{children}</View>;
}
function Chip({
  text,
  selected,
  onPress,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.chipText, selected && styles.selectedText]}>
        {text}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 23, fontWeight: '900', color: colors.text },
  reset: { fontWeight: '900', color: colors.coralDark },
  label: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.coral, borderColor: colors.coral },
  chipText: { fontWeight: '700', color: colors.text },
  selectedText: { color: colors.white },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: colors.bg,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safe}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          // Only display top-level tabs we intentionally added to the layout
          const allowed = ['index', 'task', 'profile'];
          if (!allowed.includes(route.name)) return null;

          const isFocused = state.index === index;
          const descriptor = descriptors[route.key];
          const { options } = descriptor;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as any);
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const color = isFocused ? Colors.light.tabIconSelected : Colors.light.tabIconDefault;

          const icon = options.tabBarIcon ? (options.tabBarIcon as any)({ color, size: 24 }) : null;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}>
              {icon}
              <Text style={[styles.label, { color }]} numberOfLines={1} allowFontScaling={false}>
                {options.title ?? route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: 'transparent' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: Colors.light.background,
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'android' ? 8 : 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

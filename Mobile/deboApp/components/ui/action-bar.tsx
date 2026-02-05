import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

type Props = {
  title?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function ActionBar({ title, style, children }: Props) {
  return (
    <LinearGradient
      colors={[Colors.light.tint, Colors.light.brandBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, style]}>
      <View style={styles.inner}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

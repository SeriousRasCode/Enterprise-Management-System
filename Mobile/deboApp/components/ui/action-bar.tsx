import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Props = {
  title?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
};

export default function ActionBar({ title, style, children, showBack, onBack }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe]}>
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.brandBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, style]}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="Back">
              <IconSymbol name="chevron.right" size={28} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.center} pointerEvents="none">
          {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
        </View>
        <View style={styles.right} pointerEvents="box-none">
          {children}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: 'transparent' },
  container: {
    height: 56,
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  left: { width: 48, alignItems: 'flex-start', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  right: { width: 48, alignItems: 'flex-end', justifyContent: 'center' },
  backButton: { padding: 6 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Input(props: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput placeholderTextColor="#9AA4A8" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E9EA',
    overflow: 'hidden',
    marginBottom: 12,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    color: '#0B1A1A',
  },
});

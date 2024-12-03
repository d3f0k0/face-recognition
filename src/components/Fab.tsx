import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, View } from 'react-native';

interface FABtype {
  label: any;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  style?: ViewStyle;
}

export default function Fab({ label, onPress, size = 56 ,style }: FABtype) {
  return (
    <TouchableOpacity
      style={[styles.fab, { width: size, height: size, borderRadius: size / 2 }, style]}
      onPress={onPress}
    >
      <View>{label}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#9966CC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

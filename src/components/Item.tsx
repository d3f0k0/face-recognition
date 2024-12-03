import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ItemEntity {
    id: number;
    done: boolean;
    value: string;
  }

export function Item({
    item,
    onPressItem,
  }: {
    item: ItemEntity;
    onPressItem: (id) => void | Promise<void>;
  }) {
    const { id, done, value } = item;
    return (
      <TouchableOpacity
        onPress={() => onPressItem && onPressItem(id)}
        style={[styles.item, done && styles.itemDone]}
      >
        <Text style={[styles.itemText, done && styles.itemTextDone]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        padding: 8,
      },
      itemDone: {
        backgroundColor: '#1c9963',
      },
      itemText: {
        color: '#000',
      },
      itemTextDone: {
        color: '#fff',
      },

})
  
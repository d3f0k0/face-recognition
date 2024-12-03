import { StyleSheet, View, TextInput } from 'react-native';

type CreateFormType = {
  placeholder: string;
  onChange?: any;
};

export default function CreateForm({ placeholder, onChange }: CreateFormType) {
    return (
      <View
        style={[
          styles.formContainer,
          //{borderColor: "#333", borderRadius: 10, borderWidth: 1},
        ]}>
        <TextInput style={[styles.form, { backgroundColor: '#fff' }]}
         placeholder={placeholder}
         onChangeText={onChange} >
        </TextInput>
      </View>
    );

}

const styles = StyleSheet.create({
  formContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  form: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: "#333",
    borderWidth: 1
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
  },
});

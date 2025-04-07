import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface MTextProp {
  buttontext: string;
  onPress?: () => void; // Optional click handler
}

export function Mbutton({ buttontext, onPress }: MTextProp) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttontext}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    width: '90%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Medium', // ensure it's loaded via useFonts elsewhere
  },
});

export default Mbutton;

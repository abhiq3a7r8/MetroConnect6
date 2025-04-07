import { View, TextInput } from "react-native";

export function Passinput() {
    return (
        <View className="w-[90%] flex-row justify-between">
            {[...Array(3)].map((_, index) => (
                <TextInput 
                    key={index} 
                    className="text-lg bg-slate-100 border-2 rounded-lg border-zinc-200 h-12 w-24 text-center"
                    maxLength={4} 
                    keyboardType="numeric" 
                />
            ))}
        </View>
    );
}

export default Passinput;

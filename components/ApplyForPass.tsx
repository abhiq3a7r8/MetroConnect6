import React, { useState } from 'react';
import { View, Text, TextInput, Image, Alert, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ApplyPass = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [aadhaar, setAadhaar] = useState(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name || !age || !idNumber || !photo || !aadhaar) {
      Alert.alert('Please fill in all fields and upload both images.');
      return;
    }

    Alert.alert('Pass Application Submitted!', `Name: ${name}\nAge: ${age}\nID: ${idNumber}`);
    // Replace with actual submission logic
  };

  return (
    <View className="bg-white rounded-xl p-5 m-2">
      <Text className="font-poppins text-2xl text-center mb-4">Apply for Metro Pass</Text>

      <TextInput 
        className="border border-zinc-400 p-2 rounded-md mb-3"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput 
        className="border border-zinc-400 p-2 rounded-md mb-3"
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      
      <TextInput 
        className="border border-zinc-400 p-2 rounded-md mb-3"
        placeholder="ID Number"
        value={idNumber}
        onChangeText={setIdNumber}
      />

      {/* Upload Photo Section */}
      <Text className="text-lg font-poppins mb-1">Upload Profile Photo</Text>
      {photo && <Image source={{ uri: photo }} className="w-24 h-24 rounded-full mx-auto mb-3" />}
      <Pressable 
        className="bg-blue-600 py-2 px-4 rounded-lg mb-3 self-center"
        onPress={() => pickImage(setPhoto)}
      >
        <Text className="text-white font-poppins">Upload Photo</Text>
      </Pressable>

      {/* Upload Aadhaar Card Section */}
      <Text className="text-lg font-poppins mb-1 mt-4">Upload Aadhaar Card</Text>
      {aadhaar && <Image source={{ uri: aadhaar }} className="w-36 h-24 rounded-lg mx-auto mb-3" />}
      <Pressable 
        className="bg-blue-600 py-2 px-4 rounded-lg mb-3 self-center"
        onPress={() => pickImage(setAadhaar)}
      >
        <Text className="text-white font-poppins">Upload Aadhaar Card</Text>
      </Pressable>

      {/* Submit Button */}
      <Pressable 
        className="bg-green-600 py-3 rounded-lg mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-poppins">Submit Application</Text>
      </Pressable>
    </View>
  );
};

export default ApplyPass;

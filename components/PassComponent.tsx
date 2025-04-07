import React from 'react';
import { View, Text, Image } from 'react-native';
import Mbutton from './MButton';

const MetroPass = () => {
  return (
    <View className="bg-white rounded-xl p-5 m-2 border border-zinc-300">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-poppinsBold p-2">Abhirat More</Text>
        <View className='bg-zinc-100 h-10 w-auto items-center px-2 border rounded-md flex-row'>
          <Text className='font-poppinsBold'>Line</Text>
          <View className='h-8 w-5 bg-cyan-400 justify-center items-center rounded-l-md ml-2'><Text className='font-poppinsMedium text-white'>3</Text></View>
          <View className='h-8 w-5 bg-green-500 justify-center items-center '><Text className='font-poppinsMedium text-white'>6</Text></View>
          <View className='h-8 w-7 bg-yellow-500 justify-center items-center rounded-r-md'><Text className='font-poppinsMedium text-white'>2A</Text></View>
        </View>
      </View>

      <View className="mb-4">
        <View className='flex-row justify-between px-2'>
          <Text className="text-lg font-poppins mb-1">Pass Number: </Text>
          <Text>#9876</Text>
        </View>
        <View className='flex-row justify-between px-2'>
          <Text className="text-lg font-poppins mb-1">Valid Till: </Text>
          <Text>2025-06-30</Text>
        </View>
        <View className='flex-row justify-between px-2 mt-2'>
          <Text className="text-2xl font-poppinsBold mb-1">Trips Left: </Text>
          <Text className='text-2xl font-poppinsBold '>41 / 60</Text>
        </View>
      </View>

      <View className="items-center pt-2 border-t border-cyan-200">
        <Mbutton buttontext='scan now'/>
      </View>
    </View>
  );
};

export default MetroPass;
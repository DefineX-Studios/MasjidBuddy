import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const WhatsAppLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log('Login with:', phoneNumber, otp);
  };

  const handleRegister = () => {
    console.log('Register with:', phoneNumber);
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-5">
      <View className="w-11/12 max-w-md items-center">
        <Text className="mb-5 text-2xl font-bold text-green-500">WhatsApp Login</Text>

        <TextInput
          className="w-full p-3 mb-5 bg-gray-700 text-white rounded"
          placeholder="Enter phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TextInput
          className="w-full p-3 mb-5 bg-gray-700 text-white rounded"
          placeholder="Enter OTP"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
        />

        <View className="w-full mb-3">
          <Button title="Login" onPress={handleLogin} color="#4CAF50" />
        </View>

        <View className="w-full">
          <Button title="Register" onPress={handleRegister} color="#4CAF50" />
        </View>
      </View>
    </View>
  );
};

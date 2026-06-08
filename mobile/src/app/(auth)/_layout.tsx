import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const AuthLayout = () => {
  const isAuth = true; // Replace with actual authentication logic
  if (isAuth) return <Redirect href="../(tabs)" />;

  return (
    <View>
      <Text>AuthLayout</Text>
    </View>
  );
};

export default AuthLayout;

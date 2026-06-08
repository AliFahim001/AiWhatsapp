import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/expo";

const ProfileTab = () => {
  const { signOut } = useAuth(); // Replace with actual sign-out logic
  return (
    <ScrollView
      className="bg-surface"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text className="text-white">ProfileTab</Text>
      <Pressable
        className="mt-20 bg-green-500 px-4 py-2 rounded-lg"
        onPress={() => signOut()}
      >
        <Text> Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;

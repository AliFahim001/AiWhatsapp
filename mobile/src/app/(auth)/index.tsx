import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import useAuthSocial from "../../../hooks/useSocialAuth";
const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden"></View>

      <SafeAreaView className="flex-1">
        {/* Top Section Branding */}
        <View className="items-center pt-10">
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="text-4xl font-bold text-primary font-serif tracking-wider uppercase">
            AI WhatsApp
          </Text>
        </View>

        <View className="flex-1 items-center justify-content p-5">
          {/* Center Section Image */}
          <Image
            source={require("../../../assets/images/auth.png")}
            style={{ width: width - 48, height: height * 0.3 }}
            contentFit="contain"
          />
          {/* Headline Tagline */}
          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Connect & Chat
            </Text>
            <Text className="text-3xl font-bold text-primary font-mono">
              Seamlessly
            </Text>
          </View>

          {/* Auth Buttons */}
          <View className="flex-row gap-4 mt-10">
            {/* Google Sign-In Button */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 rounded-2xl py-4 active:scale-[0.97]"
              disabled={loadingStrategy === "oauth_google"}
              onPress={() => handleSocialAuth("oauth_google")}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <>
                  <Image
                    source={require("../../../assets/images/google.png")}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                  <Text className="text-gray-900 font-semibold text-sm">
                    Google
                  </Text>
                </>
              )}
            </Pressable>

            {/* Apple Sign-In Button */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 active:scale-[0.97]"
              disabled={loadingStrategy === "oauth_apple"}
              onPress={() => handleSocialAuth("oauth_apple")}
            >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  <Text className="text-foreground font-semibold text-sm">
                    Apple
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;

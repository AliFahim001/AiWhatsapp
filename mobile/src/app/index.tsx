import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text className="font-bold text-red-500 text-4xl bg-orange-500 p-4 rounded-lg">
        Hello World
      </Text>
    </View>
  );
}

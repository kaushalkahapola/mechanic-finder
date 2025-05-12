import { View } from "react-native";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-4xl">Welcome to Mechanic Finder!</Text>
      <Text className="text-lg mt-4">
        Find the best services for your vehicle needs.
      </Text>
    </View>
  );
}

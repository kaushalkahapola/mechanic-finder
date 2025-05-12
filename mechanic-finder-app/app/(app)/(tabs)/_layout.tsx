import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerStyle: {
          backgroundColor: "bg-slate-100",
        },
        headerShadowVisible: false,
        headerTintColor: "black",
        tabBarStyle: {
          backgroundColor: "bg-slate-100",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={24}
              />
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="get-help"
        options={{
          title: "Get Help",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>
              <Ionicons
                name={focused ? "warning" : "warning-outline"}
                color={color}
                size={24}
              />
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={24}
              />
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

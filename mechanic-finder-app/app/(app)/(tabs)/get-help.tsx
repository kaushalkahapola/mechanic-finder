import { Card, Text } from "react-native-paper";
import { ReactNode } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

type HelpCardProps = {
  title: string;
  children: ReactNode;
};

function HelpCard({ title, children }: HelpCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{children}</Text>
    </Card>
  );
}

export default function GetHelpScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HelpCard title="Vehicle Breakdown">
          Your vehicle has broken down on the road
        </HelpCard>
        <HelpCard title="Scheduled Maintenance">
          Routine maintenance is required
        </HelpCard>
        <HelpCard title="Battery Issue">The vehicle's battery is dead</HelpCard>
        <HelpCard title="Fuel Shortage">Your vehicle is out of fuel</HelpCard>
        <HelpCard title="Need Towing">Request a tow service</HelpCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardContent: {
    fontSize: 14,
    color: "#666",
  },
});

import { Card, Text, Button, Avatar } from "react-native-paper";
import { useSession } from "../../../ctx";
import { View, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { signOut, user } = useSession();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={100}
          source={{ uri: "https://via.placeholder.com/100" }}
        />
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>

          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.signOutButton}
        onPress={() => {
          signOut();
        }}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  infoCard: {
    marginBottom: 20,
    padding: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "#d9534f",
  },
});

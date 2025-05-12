import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSession } from "../ctx";
import { TextInput } from "react-native-paper";
import { Text } from "react-native-paper";
import { Button, Card } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export default function SignIn() {
  const { signIn, signUp, user } = useSession();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd: string) => {
    return pwd.length >= 6 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleSubmit = async () => {
    setError("");

    try {
      if (isRegistering) {
        if (!validatePassword(password)) {
          setError(
            "Password must be at least 6 characters and include letters and numbers."
          );
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        await signUp(name, email, password, phone);
      } else {
        await signIn(email, password);
      }
      router.replace("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering ? "Register to get started!" : "Sign in to continue"}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {isRegistering && (
          <TextInput
            label="Your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {isRegistering && (
          <View>
            <TextInput
              label="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
            <TextInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        )}

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          {isRegistering ? "Register" : "Sign In"}
        </Button>

        <Button
          mode="text"
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.switchButton}
        >
          {isRegistering
            ? "Already have an account? Sign In"
            : "Don't have an account? Register"}
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#6200ee",
  },
  switchButton: {
    marginTop: 8,
  },
});

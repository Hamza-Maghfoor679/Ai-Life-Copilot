import { clearUser, setToken } from "@/src/redux/slices/UserSlice";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleLogout = () => {
    dispatch(clearUser());
    // Additional logout logic if needed
    dispatch(setToken(""));
    router.replace("../(auth)");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.photoURL }}
        style={{ width: 100, height: 100, borderRadius: 100 }}
      />
      <Text style={styles.name}>{user?.name}</Text>

      <Text style={styles.bio}>
        This is my bio. You can write something about yourself!
      </Text>

      <Button
        title="Edit Profile"
        onPress={() => alert("Edit profile clicked")}
      />
      <Button title="Logout" onPress={() => handleLogout()} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#f2f2f2",
    gap: 10,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#4CAF50",
    marginBottom: 10,
  },
  editText: {
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

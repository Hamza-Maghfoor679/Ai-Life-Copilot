import { styles } from "@/assets/styles/profileStyles";
import { clearUser, setToken } from "@/src/redux/slices/UserSlice";
import DefaultButton from "@/src/reusables/Button";
import Header from "@/src/reusables/Header";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout", 
      "Are you sure you want to sign out of your account? Your progress is safely synced.", 
      [
        { text: "Stay Logged In", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            dispatch(clearUser());
            dispatch(setToken(""));
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header initialText={"My Account"} />

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.photoURL || "https://i.pravatar.cc/150",
            }}
            style={styles.profilePic}
          />

          <Text style={styles.name}>{user?.name || "Guest User"}</Text>

          <Text style={styles.bio}>
            {user?.bio || "Your journey is unique. Add a personal reflection or a quote that inspires your daily intentions."}
          </Text>

          <DefaultButton
            title="Account Settings"
            onPress={() => Alert.alert("Settings", "Profile customization will be available in the next update.")}
          />
        </View>
      </View>

      <DefaultButton
        title="Upgrade to Prime"
        onPress={() => Alert.alert("Coming Soon", "Unlock advanced AI insights and unlimited intention tracking with Prime.")}
        backgroundColor="#2e7d32"
        style={{
          marginBottom: 16,
          width: "90%",
          alignSelf: "center",
          elevation: 4, 
        }}
      />

      <View style={styles.footer}>
        <DefaultButton
          title="Sign Out"
          onPress={handleLogout}
          backgroundColor="#eb3e3e"
        />
        <Text style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 12 }}>
           Version 1.0.4 (Build 22)
        </Text>
      </View>
    </View>
  );
};
export default Profile;
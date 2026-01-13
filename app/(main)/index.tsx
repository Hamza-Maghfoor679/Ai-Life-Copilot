import { RootState } from "@/src/redux/store";
import Header from "@/src/reusables/Header";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const MainIndex = () => {
  const user = useSelector((state: RootState) => state.user?.user);
const value = 72;
  return (
    <>
      <Header initialText={`Welcome ${user?.name}`} />
      <SafeAreaView style={styles.container}>
        <AnimatedCircularProgress
        size={180}            // diameter of the circle
        width={15}            // thickness of the stroke
        fill={value}          // current value
        tintColor="#4CAF50"   // progress color
        backgroundColor="#E0E0E0" // background track color
        rotation={0}          // start from top
      >
        {(fill) => (
          <Text style={styles.text}>{`${Math.round(fill)}%`}</Text>
        )}
      </AnimatedCircularProgress>
      </SafeAreaView>
    </>
  );
};

export default MainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  }
});

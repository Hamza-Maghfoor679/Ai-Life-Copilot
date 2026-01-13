import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface HeaderProps {
  initialText?: string| null;
  children?: React.ReactNode;
}

const Header = ({initialText, children}: HeaderProps) => {
  return (
    <View
      style={{
        height: height * 0.17,
        backgroundColor: "#234C6A",
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        justifyContent: "flex-end",
        padding: 20
      }}
    >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "600" }}>
        {initialText}
        </Text>
        {children}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

interface DefaultButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode; // pass any icon component
  iconPosition?: "left" | "right" | "center"; // icon placement
  spacing?: number; // space between icon and text
  disabled?: boolean;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  title,
  onPress,
  disabled = false,
  backgroundColor = disabled ? '#586974' : "#234C6A",
  textColor = "#fff",
  style = {},
  textStyle = {},
  icon,
  iconPosition = "left",
  spacing = 8,
}) => {
  const renderContent = () => {
    if (!icon) return <Text style={[styles.text, textStyle, { color: textColor }]}>{title}</Text>;

    const content = (
      <>
        {iconPosition === "left" && <View style={{ marginRight: spacing }}>{icon}</View>}
        <Text style={[styles.text, textStyle, { color: textColor }]}>{title}</Text>
        {iconPosition === "right" && <View style={{ marginLeft: spacing }}>{icon}</View>}
      </>
    );

    return <View style={[styles.content, iconPosition === "center" && { justifyContent: "center" }]}>{content}</View>;
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default DefaultButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
  },
});

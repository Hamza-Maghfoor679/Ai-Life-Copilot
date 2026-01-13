import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface GaugeProps {
  value: number;
  maxValue?: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  duration?: number;
}

export default function SemiCircleGauge({
  value,
  maxValue = 100,
  radius = 100,
  strokeWidth = 20,
  color = '#4ade80',
  backgroundColor = '#e5e7eb',
  duration = 800,
}: GaugeProps) {
  const animated = useRef(new Animated.Value(0)).current;

  const clamped = Math.min(Math.max(value, 0), maxValue);
  const progress = clamped / maxValue;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Add padding for stroke
  const padding = strokeWidth / 2;
  const diameter = radius * 2 + strokeWidth; // account for stroke
  const center = radius + padding;
  const circumference = Math.PI * radius;

const arcPath = `M ${padding} ${center} a ${radius} ${radius} 0 1 1 ${radius * 2} 0`;

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

return (
 <View style={{ width: diameter, height: radius + strokeWidth }}>
  <Svg width={diameter} height={radius + strokeWidth}>
    <Path
      d={arcPath}
      stroke={backgroundColor}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={`${circumference} ${circumference}`}
    />
    <AnimatedPath
      d={arcPath}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={`${circumference} ${circumference}`}
      strokeDashoffset={strokeDashoffset}
    />
  </Svg>
</View>
);

}

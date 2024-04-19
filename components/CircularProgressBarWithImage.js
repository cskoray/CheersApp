import React, { useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CircularProgressBarWithImage = ({
  targetValue = 80,
  imageUrl,
  width = 104,
  height = 104,
  borderRadius = 52,
}) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        // Assuming a constant increment for demonstration purposes
        setProgress((prevProgress) => prevProgress + 10);
      }, 50); // Change interval to 50
    }

    // Clear the interval at a specific progress value
    if (progress >= targetValue) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [targetValue, progress]);

  // State to track the progress
  const [progress, setProgress] = React.useState(0);

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={Math.max(width, height)}
        width={3} // Change width to 5
        fill={progress}
        tintColor="#0f172a" // Blue color for the filled part
        backgroundColor="transparent" // Default is transparent
        lineCap="round"
        arcSweepAngle={targetValue * (360 / 100)} // Set to 360 for a full circle
        rotation={180} // Change rotation to 180
      >
        {(fill) => (
          <Image
            source={{ uri: imageUrl }}
            style={{ width, height, borderRadius }}
          />
        )}
      </AnimatedCircularProgress>

      {/* Display targetValue in a blue box below the progress bar */}
      <View style={styles.targetBox}>
        <Text style={styles.targetText}>{targetValue}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  targetBox: {
    position: "absolute",
    bottom: -20,
    backgroundColor: "#0f172a",
    padding: 6,
    borderRadius: 20,
    width: 50,
    alignItems: "center",
  },
  targetText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CircularProgressBarWithImage;

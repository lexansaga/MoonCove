import React, { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";

interface FloatingGlitterProps {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

const FloatingGlitter: React.FC<FloatingGlitterProps> = ({
  top,
  left,
  right,
  bottom,
}) => {
  const [opacity] = useState(new Animated.Value(1));
  const [position, setPosition] = useState(getRandomPosition());

  // Function to generate a random position if no props are provided
  function getRandomPosition() {
    return {
      top: top ?? `${Math.floor(Math.random() * 120)}%`,
      left: left ?? `${Math.floor(Math.random() * 100)}%`,
      right: right ?? undefined,
      bottom: bottom ?? undefined,
    };
  }

  // Function to start the blink animation
  const startBlinkAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
  };

  useEffect(() => {
    const initialDelay = Math.random() * 2000;
    let blinkAnimation = startBlinkAnimation();

    // Start blinking with initial delay
    setTimeout(() => blinkAnimation.start(), initialDelay);

    // Change position every 30 seconds if no specific positioning is provided
    if (!top && !left && !right && !bottom) {
      const positionInterval = setInterval(() => {
        // Stop the current blink animation
        blinkAnimation.stop();

        // Fade out before changing position
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Update to a new random position
          setPosition(getRandomPosition());

          // Fade back in and restart the blink animation
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            blinkAnimation = startBlinkAnimation();
            blinkAnimation.start();
          });
        });
      }, 30000);

      // Cleanup interval on component unmount
      return () => clearInterval(positionInterval);
    }

    // Cleanup blinking animation on component unmount
    return () => blinkAnimation.stop();
  }, [top, left, right, bottom]);

  return (
    <Animated.Image
      source={require("@Assets/glitters-left.png")}
      style={[
        styles.glitter,
        { opacity },
        { top, left, right, bottom },
        !top && !left && !right && !bottom ? position : null,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  glitter: {
    position: "absolute",
    width: 25,
    height: 25,
    zIndex: 2,
  },
});

export default FloatingGlitter;

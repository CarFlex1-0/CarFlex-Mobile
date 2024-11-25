import React from "react";
import { Card } from "tamagui";
import theme from "../../constants/theme";

export default function GlassCard({ children, style, noPad, ...props }) {
  const cardBackground = "rgba(17, 24, 39, 0.25)"; // Darker gray-blue with higher opacity

  return (
    <Card
      {...props}
      style={[
        {
          backgroundColor: cardBackground,
          padding: noPad ? 0 : props.padding || 16,
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
        style,
      ]}
    >
      {children}
    </Card>
  );
}

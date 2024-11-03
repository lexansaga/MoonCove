import React from "react";
import { Svg, Path } from "react-native-svg";
import { ViewStyle } from "react-native";
import { PUZZLE_PIECE_SIZE, COLORS } from "@Components/Puzzle/Constants";

interface PuzzlePieceProps {
  path: string;
  isVisible: boolean;
  pieceStyle?: ViewStyle;
  transform?: string; // Optional transform property to adjust position
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  path,
  isVisible,
  pieceStyle,
  transform,
}) => {
  if (!isVisible) return null;

  return (
    <Svg
      width={PUZZLE_PIECE_SIZE}
      height={PUZZLE_PIECE_SIZE}
      style={pieceStyle}
    >
      <Path d={path} fill={COLORS.primary} transform={transform} />
    </Svg>
  );
};

export default PuzzlePiece;

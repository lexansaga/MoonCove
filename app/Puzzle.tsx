import {
  COLORS,
  PUZZLE_PIECES,
  PUZZLE_PIECE_SIZE,
} from "@Components/Puzzle/Constants";
import PuzzlePiece from "@Components/Puzzle/PuzzlePiece";
import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";

const Puzzle: React.FC = () => {
  const [revealedPieces, setRevealedPieces] = useState<number[]>([]);

  const handlePiecePress = (index: number) => {
    setRevealedPieces((prev) => [...prev, index]);
  };

  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={{ uri: "https://picsum.photos/seed/picsum/600/400" }}
        style={styles.backgroundImage}
      />

      {/* Puzzle pieces overlay */}
      <View style={styles.puzzleContainer}>
        {PUZZLE_PIECES.map((piece, index) => (
          <View
            key={index}
            style={[
              styles.pieceWrapper,
              {
                left: (index % 7) * PUZZLE_PIECE_SIZE,
                top: Math.floor(index / 7) * PUZZLE_PIECE_SIZE,
              },
            ]}
          >
            <PuzzlePiece
              path={piece.path}
              onPiecePress={() => handlePiecePress(index)}
              isVisible={!revealedPieces.includes(index)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGrey,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  puzzleContainer: {
    position: "relative",
    width: PUZZLE_PIECE_SIZE * 7, // Adjust based on the grid width
    height: PUZZLE_PIECE_SIZE * 5, // Adjust based on the grid height
  },
  pieceWrapper: {
    position: "absolute",
    width: PUZZLE_PIECE_SIZE,
    height: PUZZLE_PIECE_SIZE,
  },
});

export default Puzzle;

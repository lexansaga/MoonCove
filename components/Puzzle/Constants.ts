// COLORS
export const COLORS = {
  primary: "#1a91ff",
  black: "#1e293b",
  white: "#ffffff",
  lightGrey: "#e2e8f0",
  darkGrey: "#cbd5e1",
};

// SIZES
export const SVG_BOX_SIZE = 100; // Sizes for the svgs (100x100)
export const SVG_SIZE = 60;
export const PUZZLE_PIECE_BOX_SIZE = 100; // Adjusted to make seamless
export const PUZZLE_PIECE_SIZE = 100; // Adjusted to match the box size
export const PIECES_DISTANCE = 100; // Adjusted distance for seamless fit

export const PIECE_SCALE = 0.8;

// Function to generate 7 by 5 grid of puzzle pieces
const generatePuzzleGrid = (rows: number, cols: number) => {
  const pieces = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const path = `M${x * 100} ${
        y * 100
      }h80v20a10 10 0 0 1 10 10 10 10 0 0 1-10 10v20H20a10 10 0 0 1-10-10 10 10 0 0 1 10-10V${
        y * 100
      }h20c5.519 0 10-4.481 10-10s-4.481-10-10-10H${x * 100}`;
      pieces.push({ x, y, path });
    }
  }
  return pieces;
};

// PUZZLE PIECES for 7x5 grid
export const PUZZLE_PIECES = generatePuzzleGrid(5, 7);

// FUNCTIONS
export const shuffle = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const MAX_ROTATION = 5;

export const getRandomRotation = () => {
  return Math.random() * MAX_ROTATION * 2 - MAX_ROTATION;
};

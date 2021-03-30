export const IMAGE_LANDSCAPE = {
  mode: "landscape",
  originalImage: { width: 300, height: 200 },
  aspectRatio: 1.5,
};

export const IMAGE_PORTRAIT = {
  mode: "portrait",
  originalImage: { width: 200, height: 300 },
  aspectRatio: 0.75,
};

export const IMAGE_SQUARE = {
  mode: "square",
  originalImage: { width: 300, height: 300 },
  aspectRatio: 1,
};

export const IMAGE_WIDE = {
  mode: "landscape",
  originalImage: { width: 1200, height: 200 },
  aspectRatio: 6,
  squareCount: 6,
};

export default 
  {
    landscape: IMAGE_LANDSCAPE,
    portrait: IMAGE_PORTRAIT,
    square: IMAGE_SQUARE,
    wide: IMAGE_WIDE,
  };

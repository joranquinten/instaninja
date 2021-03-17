const MODE_LANDSCAPE = "landscape";
const MODE_PORTRAIT = "portrait";

export const processDimensions = (width, height) => {
  const mode = width > height ? MODE_LANDSCAPE : MODE_PORTRAIT;

  const square = mode === MODE_LANDSCAPE ? height : width;
  const squareCount = Math.floor(width / height);
  const offset = {
    x: Math.floor((width - square * squareCount) / 2),
    y: Math.floor((height - square) / 2),
  };

  let squares = [];

  if (mode === MODE_LANDSCAPE && squareCount > 1) {
    squares = [...new Array(squareCount)].map((sqr, i) => ({
      i,
      startX: i * square + offset.x,
      endX: i + 1 * (square + offset.x),
    }));
  }

  return {
    original: {
      width,
      height,
      mode,
    },
    aspectRatio: {
      original: width / height,
    },
    crop: {
      offset,
      square,
      squares,
    },
    blur: {
      square: Math.max(width, height),
    },
  };
};

export const getFileNameFromPath = (path) => {
  const fileName = path.split("/").reverse()[0];
  return fileName
    .split(".")
    .slice(0, -1)
    .join(".");
};

export const suffixFileName = (path = "", suffix = "") => {
  const fileName = getFileNameFromPath(path);

  const levels = path.split("/");
  return levels
    .map((level, i) => {
      if (i === levels.length - 1 && suffix !== "") {
        return level.replaceAll(`${fileName}.`, `${fileName}-${suffix}.`);
      }
      return level;
    })
    .join("/");
};

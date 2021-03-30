const MODE_LANDSCAPE = "landscape";
const MODE_PORTRAIT = "portrait";
const MODE_SQUARE = "square";

export const processDimensions = (width, height) => {
  const mode =
    width === height
      ? MODE_SQUARE
      : width > height
      ? MODE_LANDSCAPE
      : MODE_PORTRAIT;

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
      endX: i * square + offset.x + square,
    }));
  }

  return {
    original: {
      width,
      height,
      mode,
    },
    aspectRatio: width / height,
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

export const getFileNameFromPath = (path = "") => {
  const fileName = path.split("/").reverse()[0];
  return fileName
    .split(".")
    .slice(0, -1)
    .join(".");
};

export const suffixFileName = (path = "", suffix = "") => {
  const fileName = getFileNameFromPath(path);

  let safeSuffix = suffix.replace(/[^a-z0-9]/gi, "").toLowerCase();

  switch (safeSuffix) {
    case "000000":
      safeSuffix = "black";
      break;
    case "ffffff":
      safeSuffix = "white";
      break;
  }

  const levels = path.split("/");
  return levels
    .map((level, i) => {
      if (i === levels.length - 1 && safeSuffix !== "") {
        return level.replace(
          new RegExp(`${fileName}.`, "gi"),
          `${fileName}-${safeSuffix}.`
        );
      }
      return level;
    })
    .join("/");
};

export const isHexValue = (input) => /^#([0-9A-F]{3}){1,2}$/i.test(input);

export const getBackgroundStyle = (input) =>
  isHexValue(input) ? input : "blurred";

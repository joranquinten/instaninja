const sharp = require("sharp");

export const blurImage = async (image, size, mode) => {
  const attr = mode === "landscape" ? "width" : "height";
  const originResized = await sharp(image)
    .resize({ [attr]: size })
    .toBuffer();

  return sharp(image)
    .resize({
      width: size,
      height: size,
      fit: "cover",
    })
    .blur(50)
    .composite([{ input: originResized }])
    .toBuffer();
};

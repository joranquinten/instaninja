const mockSharp = {
  blur: jest.fn().mockReturnThis(),
  composite: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  resize: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockReturnThis(),
};
jest.mock("sharp", () => jest.fn(() => mockSharp));
const sharp = require("sharp");
const IMAGE = undefined;
const IMAGE_SIZE = 200;
const IMAGE_MODE = "landscape";
const IMAGE_BACKGROUND = "#000";

import { blurImage } from "./image";

describe("utils/image", () => {
  beforeEach(() => {
    Object.keys(mockSharp).forEach((key) => {
      mockSharp[key].mockClear();
    });
  });
  test("should call toBuffer from sharp on calling the function", async () => {
    await blurImage();
    expect(sharp().toBuffer).toHaveBeenCalled();
  });

  test("should call the resize function with the correct values", async () => {
    await blurImage(IMAGE, 200);
    expect(sharp().resize).toHaveBeenCalledWith({ height: 200 });
    await blurImage(IMAGE, 200, IMAGE_MODE);
    expect(sharp().resize).toHaveBeenCalledWith({ width: 200 });
  });

  test("should output a composite `sharp` object when background should be blurred", async () => {
    const result = await blurImage(IMAGE, IMAGE_SIZE, IMAGE_MODE, "blurred");
    expect(result).toHaveProperty("resize");
    expect(result.resize).toHaveBeenCalledWith({
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      fit: "cover",
    });
    expect(result).toHaveProperty("blur");
    expect(result.blur).toHaveBeenCalledWith(50);
    expect(result).toHaveProperty("composite");
    expect(result.composite).toHaveBeenCalledWith([
      { input: expect.anything() },
    ]);
    expect(result).toHaveProperty("toBuffer");
  });

  test("should output a backgrounded `sharp` object when background should be blurred", async () => {
    const result = await blurImage(
      IMAGE,
      IMAGE_SIZE,
      "landscape",
      IMAGE_BACKGROUND
    );

    expect(result).toHaveProperty("jpeg");
    expect(result.blur).not.toHaveBeenCalled();
    expect(result).toHaveProperty("composite");
    expect(result.composite).toHaveBeenCalledWith([
      { input: expect.anything() },
    ]);
    expect(result).toHaveProperty("toBuffer");
  });
});

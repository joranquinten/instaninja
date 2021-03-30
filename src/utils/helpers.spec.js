import {
  processDimensions,
  getFileNameFromPath,
  suffixFileName,
  isHexValue,
  getBackgroundStyle,
} from "./helpers";

describe("utils/helpers", () => {
  describe("processDimensions", () => {
    test("should return an object", () => {
      expect(typeof processDimensions()).toEqual("object");
    });

    test("should return the correct mode based on dimensions", () => {
      expect(processDimensions(300, 10).original.mode).toEqual("landscape");
      expect(processDimensions(10, 300).original.mode).toEqual("portrait");
      expect(processDimensions(300, 300).original.mode).toEqual("square");
    });

    test("should return the original dimensions", () => {
      const {
        original: { width, height },
      } = processDimensions(1920, 1080);
      expect(width).toEqual(1920);
      expect(height).toEqual(1080);
    });

    test("should return the aspect ratio", () => {
      expect(processDimensions(20, 10).aspectRatio.original).toEqual(2);
      expect(processDimensions(10, 20).aspectRatio.original).toEqual(0.5);
      expect(processDimensions(1, 60).aspectRatio.original).toEqual(
        0.016666666666666666
      );
    });

    test("should generate crop based on the width and height of the original", () => {
      expect(processDimensions(15, 10).crop.square).toEqual(10);
      expect(processDimensions(10, 15).crop.square).toEqual(10);
      expect(processDimensions(10, 10).crop.square).toEqual(10);
    });

    test("should divide the offset between the total width and crop size", () => {
      expect(processDimensions(14, 10).crop.offset.x).toEqual(2);
      expect(processDimensions(10, 14).crop.offset.y).toEqual(2);
    });

    test("should round the offset to whole numbers", () => {
      expect(processDimensions(15, 10).crop.offset.x).toEqual(2);
      expect(processDimensions(17, 10).crop.offset.x).toEqual(3);
    });

    test("should generate squares when the width is more than twice the height", () => {
      expect(processDimensions(19, 10).crop.squares.length).toEqual(0);
      expect(processDimensions(20, 10).crop.squares.length).toEqual(2);
      expect(processDimensions(30, 10).crop.squares.length).toEqual(3);
    });

    test("should offset the generated squares based on the generated offset", () => {
      expect(processDimensions(24, 10).crop.squares[0].startX).toEqual(2);
      expect(processDimensions(24, 10).crop.squares[0].endX).toEqual(12);
      expect(processDimensions(24, 10).crop.squares[1].startX).toEqual(12);
      expect(processDimensions(24, 10).crop.squares[1].endX).toEqual(22);
    });

    test("should align the end of a generated square to the start of the next", () => {
      expect(processDimensions(24, 10).crop.squares[0].endX).toEqual(
        processDimensions(24, 10).crop.squares[1].startX
      );
    });

    test("should calculate the correct size for the background square", () => {
      expect(processDimensions(10, 10).blur.square).toEqual(10);
      expect(processDimensions(24, 10).blur.square).toEqual(24);
      expect(processDimensions(10, 24).blur.square).toEqual(24);
    });
  });

  describe("getFileNameFromPath", () => {
    test(`should return a type of "string"`, () => {
      expect(typeof getFileNameFromPath()).toEqual("string");
    });

    test(`should strip all ancestral paths from the provided string`, () => {
      expect(
        getFileNameFromPath("/some/or/a/lot/of/ancestors/file.jpg")
      ).toEqual("file");
    });

    test(`should the strip only the extension of the filename`, () => {
      expect(getFileNameFromPath(".dotfile")).toEqual("");
      expect(getFileNameFromPath("file.jpg")).toEqual("file");
      expect(getFileNameFromPath("file.some.jpg")).toEqual("file.some");
      expect(getFileNameFromPath("file.some.")).toEqual("file.some");
    });
  });

  describe("suffixFileName", () => {
    test(`should return a type of "string"`, () => {
      expect(typeof suffixFileName()).toEqual("string");
    });

    test(`should return and empty string when no properties are provided`, () => {
      expect(suffixFileName()).toEqual("");
    });

    test(`should lowercase the outputted suffix`, () => {
      expect(suffixFileName("file.jpg", "LOWER")).toContain("lower");
      expect(suffixFileName("file.jpg", "LOWER")).not.toContain("LOWER");
    });

    test(`should convert known hex codes to the color name`, () => {
      const knownColors = {
        "000000": "black",
        ffffff: "white",
      };

      Object.keys(knownColors).forEach((key) => {
        expect(suffixFileName("file.jpg", `#${key}`)).toEqual(
          `file-${knownColors[key]}.jpg`
        );
      });
    });

    test(`should strip all unsafe charachters from the "suffix" property`, () => {
      const safeChars = "safe";

      const unsafeSuffix = `{}[]:;"'${safeChars}@!@#$%^&*()-_+=~\`±§€/💩`;
      expect(suffixFileName("file.jpg", unsafeSuffix)).toEqual("file-safe.jpg");
    });
  });

  describe("isHexValue", () => {
    test(`should return a type of "boolean"`, () => {
      expect(typeof isHexValue()).toEqual("boolean");
    });

    test(`should return 'True' if a valid hex value is provided`, () => {
      const validHexValues = ["#fff", "#FFFFFF", "#000000", "#000", "#000"];

      validHexValues.forEach((hex) => {
        expect(isHexValue(hex)).toBeTruthy();
      });
    });

    test(`should return 'False' if an invalid hex value is provided`, () => {
      const invalidHexValues = [
        "#ffff",
        "#FFFFFFF",
        "some",
        "",
        "000",
        123,
        "rgb(255, 255, 255)",
      ];

      invalidHexValues.forEach((hex) => {
        expect(isHexValue(hex)).toBeFalsy();
      });
    });
  });

  describe("getBackgroundStyle", () => {
    test(`should return a type of "string"`, () => {
      expect(typeof getBackgroundStyle()).toEqual("string");
    });

    test(`should return "blurred" if no or no valid HEX value is provided`, () => {
      expect(getBackgroundStyle()).toEqual("blurred");
      expect(getBackgroundStyle("#notvalidhex")).toEqual("blurred");
    });

    test(`should return the HEX value if a valid HEX value is provided`, () => {
      const validHexValue = "#fff";
      expect(getBackgroundStyle(validHexValue)).toEqual(validHexValue);
    });
  });
});

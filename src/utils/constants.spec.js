import { DEFAULT_IMAGE_DIALOG_OPTIONS } from "./constants";

describe("utils/constants", () => {
  describe("DEFAULT_IMAGE_DIALOG_OPTIONS", () => {
    test("should return an object", () => {
      expect(typeof DEFAULT_IMAGE_DIALOG_OPTIONS).toEqual("object");
    });

    test("should return an object with the required properties", () => {
      expect(DEFAULT_IMAGE_DIALOG_OPTIONS).toHaveProperty("title");
      expect(DEFAULT_IMAGE_DIALOG_OPTIONS).toHaveProperty("buttonLabel");
      expect(DEFAULT_IMAGE_DIALOG_OPTIONS).toHaveProperty("filters");
    });
  });
});

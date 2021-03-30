jest.mock("electron", () => ({
  remote: {
    dialog: jest.fn(),
  },
}));

import { shallowMount } from "@vue/test-utils";

import ImageProcessor from "./ImageProcessor";

describe("components/ImageProcessor", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ImageProcessor);
  });

  describe("methods", () => {
    describe("logger", () => {
      test("should $emit if a value is received", () => {
        expect(wrapper.emitted()["logger"]).toBeFalsy();
        wrapper.vm.logger("message");
        expect(wrapper.emitted()["logger"]).toBeTruthy();
        expect(wrapper.emitted()["logger"][0][0]).toEqual("message");
      });

      test("should not $emit when no value is received", () => {
        wrapper.vm.logger();
        expect(wrapper.emitted()["logger"]).toBeFalsy();
      });
    });

    describe("reset", () => {
      test("should update the correct properties to initial values", () => {
        const {
          vm: { file, isProcessing },
        } = wrapper;

        const originalValues = Object.freeze({
          file,
          isProcessing,
        });

        wrapper.setData({
          file: "FILE",
          isProcessing: true,
          dimensions: { width: 100, height: 100 },
        });

        expect(wrapper.vm.file).not.toEqual(originalValues.file);
        expect(wrapper.vm.isProcessing).not.toEqual(
          originalValues.isProcessing
        );
        expect(wrapper.vm.dimensions).not.toContainEqual({});

        wrapper.vm.reset();

        expect(wrapper.vm.file).toEqual(originalValues.file);
        expect(wrapper.vm.isProcessing).toEqual(originalValues.isProcessing);
        expect(wrapper.vm.dimensions).toEqual({});
      });
    });
  });

  describe("computed", () => {
    describe("isSquareImage", () => {
      test("should return `true` on the correct conditions", () => {
        wrapper.setData({
          isImageLoaded: true,
          dimensions: {
            aspectRatio: 1,
          },
        });
        expect(wrapper.vm.isSquareImage).toBeTruthy();
      });

      test("should return `false` on the correct conditions", () => {
        wrapper.setData({
          isImageLoaded: true,
          dimensions: {
            aspectRatio: 2,
          },
        });
        expect(wrapper.vm.isSquareImage).toBeFalsy();

        wrapper.setData({
          isImageLoaded: true,
          dimensions: {
            aspectRatio: 0.5,
          },
        });
        expect(wrapper.vm.isSquareImage).toBeFalsy();

        wrapper.setData({
          isImageLoaded: true,
          dimensions: {},
        });
        expect(wrapper.vm.isSquareImage).toBeFalsy();

        wrapper.setData({
          isImageLoaded: false,
          dimensions: {
            aspectRatio: 1,
          },
        });
        expect(wrapper.vm.isSquareImage).toBeFalsy();
      });
    });

    describe("isImageAvailable", () => {
      test("should return `true` on the correct conditions", () => {
        wrapper.setData({
          isImageLoaded: true,
          dimensions: {
            original: {
              width: 100,
              height: 100,
            },
            crop: {
              squares: [],
            },
          },
        });
        expect(wrapper.vm.isImageAvailable).toBeTruthy();
      });

      test("should return `false` on the correct conditions", () => {
        wrapper.setData({
          isImageLoaded: true,
          dimensions: {
            aspectRatio: 1,
          },
        });
        expect(wrapper.vm.isImageAvailable).toBeFalsy();

        wrapper.setData({
          isImageLoaded: false,
          dimensions: {
            aspectRatio: 1,
          },
        });
        expect(wrapper.vm.isImageAvailable).toBeFalsy();
      });
    });
  });
});

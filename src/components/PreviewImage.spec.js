import { shallowMount } from "@vue/test-utils";

import PreviewImage from "./PreviewImage";

import IMAGES from "../../test/stubs/image";

describe("components/PreviewImage", () => {
  Object.keys(IMAGES).forEach((type) => {
    test(`should render a summary in "${type}" mode`, () => {
      const wrapper = shallowMount(PreviewImage, { propsData: IMAGES[type] });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});

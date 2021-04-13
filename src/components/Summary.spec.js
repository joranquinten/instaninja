import { shallowMount } from "@vue/test-utils";

import Summary from "./Summary";

import IMAGES from "../../test/stubs/image";

describe("components/Summary", () => {
  Object.keys(IMAGES).forEach(type => {
    test(`should render a summary in "${type}" mode`, () => {
      const wrapper = shallowMount(Summary, { propsData: IMAGES[type] });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});

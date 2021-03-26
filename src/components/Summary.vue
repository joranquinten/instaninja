<template>
  <v-sheet class="summary" rounded v-if="dimensions">
    <preview-image
    :key="imageUrl"
      v-if="imageUrl"
      :imageUrl="imageUrl"
      :dimensions="dimensions"
    />
    <div
      v-html="`<p>${original} ${result} ${preview}</p><p>${nextStep}</p>`"
    ></div>
  </v-sheet>
</template>
<script>
import PreviewImage from "./PreviewImage";
export default {
  components: {
    PreviewImage,
  },
  props: {
    dimensions: {
      type: Object,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  computed: {
    original() {
      const { original, aspectRatio } = this.dimensions;
      const addendum =
        aspectRatio.original >= 2
          ? ` It's too wide for a square. Sooooo let's slice it up! ✂️`
          : ``;
      return `I've detected a pretty ${original.mode} photo with a resolution of <strong>${original.width}px</strong> ✕ <strong>${original.height}px</strong> 👀.${addendum}`;
    },
    result() {
      const {
        crop: { squares },
      } = this.dimensions;
      return squares.length <= 1
        ? "I will <strong>not</strong> slice into multiple squares, but I'll do you the favor of creating a square out of the original with a blurred background. 👌"
        : `I will slice this into <strong>${squares.length}</strong> squares and will create a square out of the original with a blurred background. 🤙`;
    },
    preview() {
      return this.imageUrl
        ? `The image above gives a decent representation of the expected slices.`
        : "";
    },
    nextStep() {
      return `Pick a new photo, or click the Generate button to unleash slashing ninjas on your precious work of art.`;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  margin: 0 0 2em;
  padding: 1em;

  .example {
    margin: 0 auto;
  }
}
</style>

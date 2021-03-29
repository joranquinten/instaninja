<template>
  <v-sheet class="summary" rounded v-if="dimensions">
    <div
      v-html="`<p>${original} ${result} ${preview}</p><p>${nextStep}</p>`"
    ></div>
  </v-sheet>
</template>
<script>
export default {
  components: {},
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
    mode() {
      const { original, aspectRatio } = this.dimensions;
      return aspectRatio.original === 1 ? "square" : original.mode;
    },
    original() {
      if (this.mode === "square") {
        return ` Did you realise that it's already perfectly square?`;
      }
      const { original, aspectRatio } = this.dimensions;
      const addendum =
        aspectRatio.original >= 2
          ? ` It's too wide for a square. Sooooo let's slice it up! ✂️`
          : ``;
      return `I've detected a pretty ${original.mode} photo with a resolution of <strong>${original.width}px</strong> ✕ <strong>${original.height}px</strong> 👀.${addendum}`;
    },
    result() {
      if (this.mode === "square") {
        return `Not going to slice anything!`;
      }

      const {
        crop: { squares },
      } = this.dimensions;
      return squares.length <= 1
        ? "I will <strong>not</strong> slice into multiple squares, but I'll do you the favor of creating a square out of the original with a blurred background. 👌"
        : `I will slice this into <strong>${squares.length}</strong> squares and will create a square out of the original with a blurred background. 🤙`;
    },
    preview() {
      return this.imageUrl && this.mode !== "square"
        ? `The image to the right gives a decent representation of the expected slices.`
        : "";
    },
    nextStep() {
      return this.mode === "square"
        ? `Please pick a new photo`
        : `Pick a new photo, or click the Generate button to unleash slashing ninjas on your precious work of art.`;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  margin: 0 0 2em;
  padding: 1em;
}
</style>

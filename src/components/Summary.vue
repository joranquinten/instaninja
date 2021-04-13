<template>
  <v-sheet class="summary" rounded>
    <div
      v-html="`<p>${original} ${result} ${preview}</p><p>${nextStep}</p>`"
    ></div>
  </v-sheet>
</template>
<script>
export default {
  components: {},
  props: {
    mode: {
      type: String,
      required: true
    },
    originalImage: {
      type: Object,
      required: true,
    },
    aspectRatio: {
      type: Number,
      required: true,
    },
    squareCount: {
      type: Number,
      required: false,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  computed: {
    original() {
      if (this.mode === "square") {
        return ` Did you realise that it's already perfectly square?`;
      }
      const addendum =
        this.aspectRatio >= 2
          ? ` It's too wide for a square. Sooooo let's slice it up! ✂️`
          : ``;
      return `I've detected a pretty ${this.mode} photo with a resolution of <strong>${this.originalImage.width}px</strong> ✕ <strong>${this.originalImage.height}px</strong> 👀.${addendum}`;
    },
    result() {
      if (this.mode === "square") {
        return `Not going to slice anything!`;
      }

      return this.squareCount <= 1
        ? "I will <strong>not</strong> slice into multiple squares, but I'll do you the favor of creating a square out of the original with a blurred background. 👌"
        : `I will slice this into <strong>${this.squareCount}</strong> squares and will create a square out of the original with a blurred background. 🤙`;
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

<template>
  <v-sheet class="summary" elevation="10" rounded v-if="dimensions">
    <div v-html="`<p>${original} ${result}</p><p>${nextStep}</p>`"></div>
  </v-sheet>
</template>
<script>
export default {
  props: {
    dimensions: {
      type: Object,
      required: true,
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
    nextStep() {
      return `Pick a new photo, or click the Generate button to unleash slashing ninjas on your precious work of art.`;
    },
  },
};
</script>

<style>
.summary {
  margin: 2em 0;
  padding: 1em;
}
</style>

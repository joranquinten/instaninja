<template>
  <figure>
    <div
      class="preview"
      :style="{ width: `${cropSquare}px`, height: `${cropSquare}px` }"
    >
      <v-img
        v-if="imageUrl"
        :src="imageUrl"
        class="example"
        :max-width="thumb.width"
        :max-height="thumb.height"
      />
      <div v-if="numSlices" class="squares">
        <div
          :key="i"
          v-for="i in numSlices"
          :style="{ width: `${slice}px`, height: `${slice}px` }"
          class="square slice"
        >
          Slice {{ i }}
        </div>
      </div>
      <div
        v-if="mode !== 'square'"
        class="square crop"
        :class="{ landscape: mode === 'landscape' }"
        :style="{ width: `${cropSquare}px`, height: `${cropSquare}px` }"
      >
        {{ this.mode === "landscape" ? "Crop" : "Square" }}
      </div>
    </div>
    <figcaption>
      {{
        mode === "square"
          ? "👀 Look! It's already square!"
          : "☝️ Expected slices"
      }}
    </figcaption>
  </figure>
</template>

<script>
const MAX = {
  HEIGHT: 200,
  WIDTH: 240,
};
export default {
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
    factor() {
      const { original } = this.dimensions;
      const config =
        this.mode === "landscape"
          ? { max: MAX.WIDTH, handle: "width" }
          : { max: MAX.HEIGHT, handle: "height" };

      return [config.max] / original[config.handle];
    },
    thumb() {
      const {
        original: { width, height },
      } = this.dimensions;
      return {
        width: width * this.factor,
        height: height * this.factor,
      };
    },
    cropSquare() {
      const {
        thumb: { width, height },
      } = this;

      return Math.max(width, height);
    },
    slice() {
      const {
        thumb: { width, height },
      } = this;

      return this.mode === "landscape"
        ? Math.min(width, height)
        : Math.max(width, height);
    },
    numSlices() {
      const {
        crop: { squares },
      } = this.dimensions;

      return squares.length;
    },
  },
};
</script>

<style lang="scss" scoped>
figure {
  margin-bottom: 1em;
  figcaption {
    text-align: center;
    font-size: 0.72em;
  }

  .preview {
    margin: 0 auto;
    position: relative;

    .example {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
    }

    .square {
      background: rgba(255, 255, 255, 0.2);
      transition: background-color ease-in-out 0.2s;
      border: 1px solid grey;
      padding: 1em;
      font-size: 0.74em;
      &:hover {
        background: rgba(255, 255, 255, 0.6);
      }
    }

    .crop {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      z-index: 30;

      &.landscape {
        z-index: 10;
      }
    }

    .squares {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      display: flex;
      flex-direction: row;
      z-index: 20;
    }
  }
}
</style>

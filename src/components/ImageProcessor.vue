<template>
  <v-container>
    <v-row>
      <v-col :cols="isImageLoaded ? 4 : 12">
        <form enctype="multipart/form-data">
          <v-file-input
            :disabled="isProcessing"
            color="pink"
            accept="image/*"
            label="Select an image to slice"
            filled
            id="file-input"
            prepend-icon="mdi-camera"
            v-model="file"
            @change="handleFile"
            class="uploader"
          ></v-file-input>

          <v-select
            v-if="isImageLoaded && !isSquareImage"
            :items="backgroundStyles"
            v-model="backgroundStyle"
            label="Select background style"
            outlined
          ></v-select>

          <v-btn
            x-large
            color="pink"
            v-if="isImageLoaded && !isSquareImage && dimensions.crop"
            :disabled="isProcessing"
            @click.prevent="generate"
          >
            {{
              `Unleash ${dimensions.crop.squares.length + 1} ninja${
                dimensions.crop.squares.length > 1 ? "s" : ""
              }`
            }}
          </v-btn>
        </form>
      </v-col>
      <v-col cols="4">
        <slice-summary
          v-if="isImageLoaded"
          :dimensions="dimensions"
          :image-url="getImageUrl(file)"
        ></slice-summary>
      </v-col>
      <v-col cols="4">
        <preview-image
          v-if="isImageLoaded"
          :key="getImageUrl(file)"
          :imageUrl="getImageUrl(file)"
          :dimensions="dimensions"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="isDone">
      Slicing is done!
      <template v-slot:action="{ attrs }">
        <v-btn color="purple" text v-bind="attrs" @click="isDone = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-overlay class="in-progress" z-index="50" :value="isProcessing">
      <v-progress-circular
        indeterminate
        color="primary"
        class="progress"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
const electron = require("electron");
const sharp = require("sharp");
const { dialog } = electron.remote;

import {
  processDimensions,
  suffixFileName,
  getBackgroundStyle,
} from "@/utils/helpers";
import { blurImage } from "@/utils/image";

import PreviewImage from "./PreviewImage";
import sliceSummary from "./Summary";

export default {
  components: {
    PreviewImage,
    sliceSummary,
  },
  data() {
    return {
      file: null,
      backgroundStyle: "blurred",
      backgroundStyles: [
        { text: "Blurred (default)", value: "blurred" },
        { text: "Black", value: "#000000" },
        { text: "White", value: "#FFFFFF" },
      ],
      newFileName: "",
      isProcessing: false,
      isImageLoaded: false,
      dimensions: {},
      isDone: false,
      messages: [],
    };
  },
  watch: {
    file(newVal) {
      this.isImageLoaded = !!newVal;
    },
  },
  methods: {
    logger(message) {
      if (message) this.$emit("logger", message);
    },
    reset() {
      this.file = null;
      this.isProcessing = false;
      this.dimensions = {};
    },
    getImageUrl(path) {
      return path ? URL.createObjectURL(path) : undefined;
    },
    handleFile() {
      const img = new Image();
      img.onload = async () => {
        const { width, height } = img;
        this.dimensions = processDimensions(width, height);
        URL.revokeObjectURL(img.src);

        this.logger(`File ${this.file.name} selected`);
      };

      img.src = this.getImageUrl(this.file);
    },
    async getFilePath(filename = "example.jpg") {
      const browserWindow = electron.remote.getCurrentWindow();

      const options = {
        title: "Save file",
        defaultPath: filename,
        buttonLabel: "Save",

        filters: [
          { name: "jpg", extensions: ["jpg", "jpeg"] },
          { name: "All Files", extensions: ["*"] },
        ],
      };

      return await dialog.showSaveDialog(browserWindow, options);
    },
    async generate() {
      this.logger(`Generating. This could take a while...`);
      this.isProcessing = true;
      this.isDone = false;
      const data = this.file;

      this.newFileName = await this.getFilePath("insta-ninja-sliced.jpg");
      const { filePath } = this.newFileName;
      const backgroundStyle = getBackgroundStyle(this.backgroundStyle);
      const fileName = suffixFileName(filePath, backgroundStyle);

      const blurredImage = await blurImage(
        data.path,
        this.dimensions.crop.square,
        this.dimensions.original.mode,
        backgroundStyle
      );

      const {
        crop: { squares },
      } = this.dimensions;

      if (squares.length > 1) {
        const {
          crop: { square, offset },
        } = this.dimensions;
        (squares || []).forEach(async (tile, i) => {
          const fileName = suffixFileName(filePath, `tile-${i + 1}`);
          const box = {
            left: tile.startX,
            top: offset.y,
            width: square,
            height: square,
          };
          await sharp(data.path)
            .extract(box)
            .toFile(fileName);
          this.logger(`Generated: ${fileName}`);
        });
      }

      try {
        await sharp(blurredImage).toFile(fileName);
        this.logger(`Generated: ${fileName}`);
      } catch (e) {
        throw e.message;
      }

      this.isProcessing = false;
      this.isDone = true;
      this.reset();
    },
  },
  computed: {
    isSquareImage() {
      return (
        this.isImageLoaded &&
        this.dimensions &&
        this.dimensions.aspectRatio &&
        this.dimensions.aspectRatio.original === 1
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.col {
  transition: max-width ease-in-out 0.2s;
}
form {
  width: 100%;

  .uploader {
    cursor: pointer;
    flex-grow: 0;
  }

  .in-progress {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.logger {
  height: 10vh;
}
</style>

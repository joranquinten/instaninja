<template>
  <v-container>
    <v-row>
      <v-col>
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
            v-if="dimensions && dimensions.original"
            :items="backgroundStyles"
            v-model="backgroundStyle"
            label="Select background style"
            outlined
          ></v-select>

          <v-btn
            x-large
            color="pink"
            v-if="dimensions && dimensions.original"
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
      <v-col>
        <slice-summary
          v-if="dimensions && dimensions.original"
          :dimensions="dimensions"
        ></slice-summary>
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
    <v-overlay class="in-progress" :value="isProcessing">
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

import sliceSummary from "./Summary";

export default {
  components: {
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
      dimensions: {},
      isDone: false,
      messages: [],
    };
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
    handleFile() {
      const url = URL.createObjectURL(this.file);
      const img = new Image();

      img.onload = async () => {
        const { width, height } = img;
        this.dimensions = processDimensions(width, height);
        URL.revokeObjectURL(img.src);

        this.logger(`File ${this.file.name} selected`);
      };
      img.src = url;
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
};
</script>

<style lang="scss" scoped>
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

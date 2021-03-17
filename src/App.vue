<template>
  <v-app>
    <v-app-bar app color="purple" dark>
      <div class="d-flex align-center">
        Insta<strong>Ninja</strong> &ndash; Slice up your&nbsp;&nbsp;u l t r a w i d e&nbsp;&nbsp;shots
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/joranquinten/instaninja/releases/latest"
        target="_blank"
        text
      >
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <image-processor></image-processor>
    </v-main>
  </v-app>
</template>

<script>
import ImageProcessor from "./components/ImageProcessor.vue";

export default {
  name: "App",

  components: {
    ImageProcessor,
  },

  data: () => ({
    //
  }),
};
</script>

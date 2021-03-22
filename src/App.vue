<template>
  <v-app>
    <v-app-bar app color="purple" dark>
      <div class="d-flex align-center">
        <v-img
          src="./assets/instaninja.svg"
          height="32"
          width="32"
          contain
        ></v-img>
        Insta<strong>Ninja</strong>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/joranquinten/instaninja/releases/latest"
        target="_blank"
        title="Latest release"
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

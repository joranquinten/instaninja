![InstaNinja](https://raw.githubusercontent.com/joranquinten/instaninja/main/src/assets/icons/png/32x32.png)
# Insta Ninja

This is a repo that builds an electron app for Mac. The purpose of the app is to make it as easy as possible to generate [Instagram](https://instagram.com) ready images out of source files (targeted at swipeable panoramas).

## How it works

When you upload an image, the file will get analysed by the software which outputs it as a square image by taking in the longest dimension and providing a blurred instance of the image as a background. If the image is recognized as having an aspect ratio higher than 2:1, it calculates the optimal distribution of squares to split the image into.

Once the slicing is done, it'll ask for a target location and output the files to the designated folder. You can then manually upload those to Instagram.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Compiles and minifies for production
```
yarn electron:build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

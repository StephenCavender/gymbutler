import eleventy from "@11ty/eleventy";

export default {
  dir: {
    input: "src",
    output: "_site",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  passthroughFileCopy: true,
};
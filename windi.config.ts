import defaultTheme from "windicss/defaultTheme";
import { defineConfig } from "windicss/helpers";

function rem2px(input, fontSize = 16) {
  if (input == null) {
    return input;
  }
  switch (typeof input) {
    case "object":
      if (Array.isArray(input)) {
        return input.map((val) => rem2px(val, fontSize));
      } else {
        const ret = {};
        for (const key in input) {
          ret[key] = rem2px(input[key]);
        }
        return ret;
      }
    case "string":
      return input.replace(
        /(\d*\.?\d+)rem$/,
        (_, val) => parseFloat(val) * fontSize + "px"
      );
    default:
      return input;
  }
}

export default defineConfig({
  extract: {
    include: [
      "./src/**/*.{html,js,svelte}",
      "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],
  },
  // include: ["./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"],
  darkMode: "media",
  theme: {
    borderRadius: rem2px(defaultTheme.borderRadius),
    columns: rem2px(defaultTheme.columns),
    fontSize: rem2px(defaultTheme.fontSize),
    lineHeight: rem2px(defaultTheme.lineHeight),
    maxWidth: rem2px(defaultTheme.maxWidth),
    spacing: rem2px(defaultTheme.spacing),
    minHeight: rem2px(defaultTheme.minHeight),
    width: rem2px(defaultTheme.width),
    height: rem2px(defaultTheme.height),
  },
  shortcuts: {
    "btn-primary": "border-none cursor-pointer text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2",
    "btn-secondary":
      "bg-white text-sky-500 border-[1px] border-sky-500 px-2 py-3 rounded cursor-pointer",
    "title-1": "text-3xl font-extrabold",
    "title-2": "text-2xl font-bold",
    "title-3": "text-xl font-semibold",
    "title-4": "text-lg font-semibold",
    "title-5": "text-base font-medium",
    "input-1": "w-full py-2 border-none bg-white focus:outline-none",
    "input-2": "w-30 py-2 px-1 flex-1 rounded-lg border bg-white focus:outline-none",
  },
  plugins: [
    require("flowbite/plugin"),
    // require("flowbite-windicss-plugin"),
  ],
});

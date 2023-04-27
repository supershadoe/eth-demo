import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte}"],
    plugins: [daisyui],
    daisyui: {
        themes: ["business"],
        darkTheme: "business"
    },
};

/**
 * TasteCraviing — js/tailwind-config.js
 *
 * Shared Tailwind CSS configuration extracted from all 5 HTML pages.
 * Previously duplicated inline as <script id="tailwind-config"> in every page.
 *
 * Load AFTER the Tailwind CDN script, BEFORE any content:
 *   <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
 *   <script src="js/tailwind-config.js"></script>
 */

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "error-container":              "#ffdad6",
                "on-error":                     "#ffffff",
                "primary-fixed-dim":            "#ffb2bf",
                "on-tertiary-fixed":            "#261a00",
                "on-tertiary":                  "#ffffff",
                "on-secondary-fixed-variant":   "#5b403c",
                "on-secondary-fixed":           "#2b1613",
                "secondary-fixed-dim":          "#e3beb8",
                "on-primary-fixed":             "#3f0016",
                "on-error-container":           "#93000a",
                "on-surface-variant":           "#5a4044",
                "surface-bright":               "#fff9ea",
                "surface-tint":                 "#bc004f",
                "error":                        "#ba1a1a",
                "tertiary-fixed-dim":           "#fabd00",
                "on-tertiary-container":        "#fff5e7",
                "surface-container-low":        "#faf4dd",
                "secondary-container":          "#fed7d0",
                "secondary-fixed":              "#ffdad4",
                "on-primary-container":         "#fff2f3",
                "on-tertiary-fixed-variant":    "#5b4300",
                "outline":                      "#8e6f74",
                "surface-container-high":       "#efe8d2",
                "surface":                      "#fff9ea",
                "primary-container":            "#d81b60",
                "on-primary":                   "#ffffff",
                "inverse-on-surface":           "#f8f1da",
                "primary-fixed":                "#ffd9de",
                "on-background":                "#1e1c0e",
                "on-secondary-container":       "#795c57",
                "inverse-surface":              "#333121",
                "on-primary-fixed-variant":     "#90003b",
                "secondary":                    "#745853",
                "on-secondary":                 "#ffffff",
                "outline-variant":              "#e3bdc3",
                "background":                   "#fff9ea",
                "primary":                      "#b0004a",
                "surface-container-lowest":     "#ffffff",
                "surface-dim":                  "#e0dac4",
                "surface-variant":              "#e9e2cc",
                "tertiary-container":           "#8f6b00",
                "tertiary":                     "#715400",
                "tertiary-fixed":               "#ffdf9e",
                "on-surface":                   "#1e1c0e",
                "surface-container-highest":    "#e9e2cc",
                "surface-container":            "#f5eed7",
                "inverse-primary":              "#ffb2bf"
            },
            fontFamily: {
                "headline": ["Noto Serif", "serif"],
                "body":     ["Plus Jakarta Sans", "sans-serif"],
                "label":    ["Plus Jakarta Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg":      "2rem",
                "xl":      "3rem",
                "full":    "9999px"
            },
            /**
             * Material Design 3 type scale — fixes Issue #23.
             * These classes were used throughout but never defined,
             * so Tailwind was silently ignoring them.
             */
            fontSize: {
                "display-lg":   ["3.5rem",  { lineHeight: "1", fontWeight: "900" }],
                "headline-lg":  ["2rem",    { lineHeight: "1.2", fontWeight: "800" }],
                "headline-md":  ["1.75rem", { lineHeight: "1.25", fontWeight: "700" }],
                "headline-sm":  ["1.5rem",  { lineHeight: "1.3", fontWeight: "700" }],
                "body-lg":      ["1rem",    { lineHeight: "1.6" }],
                "body-md":      ["0.875rem",{ lineHeight: "1.5" }],
                "label-md":     ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.05em" }],
            }
        }
    }
};

const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  // daisyui: {
  //   themes: [
  //     {
  //       scaffoldEth: {
  //         primary:{
  //           DEFAULT: "hsl(var(--primary))",
  //           foreground: "hsl(var(--primary-foreground))",
  //         },
  //         "primary-content": "#026262",
  //         secondary:{
  //         DEFAULT: "hsl(var(--secondary))",
  //         foreground: "hsl(var(--secondary-foreground))",
  //       },
  //         "secondary-content": {
  //           DEFAULT: "hsl(var(--secondary))",
  //           foreground: "hsl(var(--secondary-foreground))",
  //         },
  //         accent: {
  //           DEFAULT: "hsl(var(--accent))",
  //           foreground: "hsl(var(--accent-foreground))",
  //         },
  //         "accent-content": "hsl(var(--accent-foreground))",
  //         error: {
  //           DEFAULT: "hsl(var(--destructive))",
  //           foreground: "hsl(var(--destructive-foreground))",
  //         },

  //         "--rounded-btn": "9999rem",

  //         ".tooltip": {
  //           "--tooltip-tail": "6px",
  //         },
  //       },
  //     },
  //     {
  //       scaffoldEthDark: {
  //         primary: "#026262",
  //         "primary-content": "#C8F5FF",
  //         secondary: {
  //           DEFAULT: "hsl(var(--secondary))",
  //           foreground: "hsl(var(--secondary-foreground))",
  //         },
  //         "secondary-content": "hsl(var(--secondary-foreground))",
  //         accent: "#C8F5FF",
  //         "accent-content": "#088484",
  //         neutral: "#E9FBFF",
  //         "neutral-content": "#11ACAC",


  //         "--rounded-btn": "9999rem",

  //         ".tooltip": {
  //           "--tooltip-tail": "6px",
  //           "--tooltip-color": "hsl(var(--s))",
  //         },
  //       },
  //     },
  //   ],
  // },
  theme: {
    screens: {
      ssm: "400px",
      sm: "640px",
      md: "800px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        grow: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        zoom: {
          "0%, 100%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1.1, 1.1)" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        grow: "grow 5s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        zoom: "zoom 1s ease infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#34EEB6",
        warning: "#FFCF72",
      },
    },
  },
};

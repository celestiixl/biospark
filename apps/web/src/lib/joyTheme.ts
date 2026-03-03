import { extendTheme } from "@mui/joy/styles";

/**
 * Joy UI theme tokens aligned with the biospark design system.
 *
 * Color variables come from globals.css:
 *   --ia-grad-from  #0ea5e9  (sky)
 *   --ia-grad-via   #2563eb  (blue)
 *   --ia-grad-to    #4f46e5  (indigo)
 *   --ia-emerald    16 185 129
 *   --ia-teal       20 184 166
 *   --ia-amber      245 158 11
 *   --ia-violet     139 92 246
 *   --ia-rose       251 113 133
 */
const joyTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          solidBg: "#2563eb",
          solidHoverBg: "#1d4ed8",
          solidActiveBg: "#1e40af",
          outlinedBorder: "#2563eb",
          outlinedColor: "#2563eb",
          outlinedHoverBg: "#eff6ff",
          softBg: "#eff6ff",
          softColor: "#1e40af",
          softHoverBg: "#dbeafe",
          softActiveBg: "#bfdbfe",
          plainColor: "#2563eb",
          plainHoverBg: "#eff6ff",
        },
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          solidBg: "#10b981",
          solidHoverBg: "#059669",
          softBg: "#ecfdf5",
          softColor: "#065f46",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          solidBg: "#f59e0b",
          solidHoverBg: "#d97706",
          softBg: "#fffbeb",
          softColor: "#92400e", // amber-800
        },
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          solidBg: "#f43f5e",
          solidHoverBg: "#e11d48",
          softBg: "#fff1f2",
          softColor: "#9f1239",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        background: {
          body: "rgb(248, 250, 252)",
          surface: "rgb(255, 255, 255)",
          popup: "rgb(255, 255, 255)",
          level1: "rgb(241, 245, 249)",
          level2: "rgb(226, 232, 240)",
          level3: "rgb(203, 213, 225)",
          tooltip: "rgb(15, 23, 42)",
          backdrop: "rgba(15, 23, 42, 0.5)",
        },
        text: {
          primary: "rgb(15, 23, 42)",
          secondary: "rgb(71, 85, 105)",
          tertiary: "rgb(148, 163, 184)",
          icon: "rgb(71, 85, 105)",
        },
      },
    },
  },

  fontFamily: {
    body: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    display: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    code: "var(--font-geist-mono), ui-monospace, monospace",
  },

  radius: {
    xs: "6px",
    sm: "8px",
    md: "14px",
    lg: "24px",
    xl: "28px",
  },

  shadow: {
    xs: "0 1px 2px rgba(15,23,42,0.06)",
    sm: "0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.06)",
    md: "0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.06)",
    lg: "0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.05)",
    xl: "0 20px 25px rgba(15,23,42,0.08), 0 10px 10px rgba(15,23,42,0.04)",
  },

  components: {
    JoyButton: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontWeight: 600,
          borderRadius: "14px",
          ...(ownerState.variant === "solid" &&
            ownerState.color === "primary" && {
              background: "linear-gradient(to right, #0ea5e9, #2563eb)",
              "&:hover": {
                background: "linear-gradient(to right, #0284c7, #1d4ed8)",
              },
            }),
        }),
      },
    },

    JoyCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: "28px",
          boxShadow:
            "0 1px 0 rgba(15,23,42,0.04), 0 18px 50px rgba(15,23,42,0.08)",
        },
      },
    },

    JoyChip: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "12px",
        },
      },
    },

    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
        },
      },
    },

    JoyTextarea: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
        },
      },
    },

    JoySelect: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
        },
      },
    },
  },
});

export default joyTheme;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // 'brand' is set at runtime via a CSS variable (--brand-color) so each
      // library's theme color (from Library.themeColor) can drive the UI
      // without rebuilding the app per tenant.
      colors: {
        brand: {
          DEFAULT: 'var(--brand-color, #2563eb)',
          light: 'var(--brand-color-light, #3b82f6)',
          dark: 'var(--brand-color-dark, #1d4ed8)',
        },
      },
    },
  },
  plugins: [],
};

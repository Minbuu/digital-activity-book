/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // บรรทัดนี้สำคัญมาก! บอกให้มันส่องหา Class ในโฟลเดอร์ src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
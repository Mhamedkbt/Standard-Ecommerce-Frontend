// postcss.config.js (CORRECT configuration)

module.exports = {
  plugins: {
    // Use the dedicated PostCSS package instead of the core 'tailwindcss' package
    '@tailwindcss/postcss': {}, 
    'autoprefixer': {},
  },
};
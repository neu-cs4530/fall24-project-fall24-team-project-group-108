
const path = require('path');

module.exports = {
  // ...existing code...
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      // ...other fallbacks if needed...
    },
  },
  // ...existing code...
};
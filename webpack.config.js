const path = require('path');

module.exports = {
  entry: './src/main.ts', // Entry point of your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply TypeScript loader for .ts files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

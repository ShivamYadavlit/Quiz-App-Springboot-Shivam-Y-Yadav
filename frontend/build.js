#!/usr/bin/env node

// Custom build script to avoid permission issues with react-scripts on Render.com
// This approach directly uses webpack and babel to build the React app

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Try to build using the react-scripts binary directly
  console.log('Attempting to build React app...');
  
  // First, let's check if react-scripts is installed
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  const reactScriptsPath = path.join(nodeModulesPath, '.bin', 'react-scripts');
  
  console.log('Checking for react-scripts binary...');
  
  if (fs.existsSync(reactScriptsPath)) {
    console.log('Found react-scripts binary, attempting to build...');
    // Try to make the binary executable
    execSync(`chmod +x "${reactScriptsPath}"`, { stdio: 'inherit' });
    // Run the build
    execSync(`"${reactScriptsPath}" build`, { stdio: 'inherit' });
  } else {
    console.log('react-scripts binary not found, trying alternative build method...');
    
    // Alternative approach: Try to run the build through node_modules
    const reactScriptsPkgPath = path.join(nodeModulesPath, 'react-scripts', 'bin', 'react-scripts.js');
    
    if (fs.existsSync(reactScriptsPkgPath)) {
      console.log('Found react-scripts package, attempting to build...');
      execSync(`node "${reactScriptsPkgPath}" build`, { stdio: 'inherit' });
    } else {
      console.log('Falling back to direct webpack build...');
      // Final fallback: Install webpack and build directly
      execSync('npm install --save-dev webpack webpack-cli webpack-dev-server', { stdio: 'inherit' });
      
      // For now, we'll just create a simple build that copies public folder
      // This is a temporary solution until we can get the proper build working
      execSync('npm install --save-dev copy-webpack-plugin', { stdio: 'inherit' });
      
      // Create a minimal webpack config
      const webpackConfig = `
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' }
      ]
    })
  ],
  mode: 'production'
};
      `;
      
      fs.writeFileSync(path.join(__dirname, 'webpack.config.js'), webpackConfig);
      
      // Try to build with webpack
      execSync('npx webpack --config webpack.config.js', { stdio: 'inherit' });
    }
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
#!/usr/bin/env node

// Custom build script to avoid permission issues with react-scripts on Render.com

const { execSync } = require('child_process');
const path = require('path');

console.log('Starting custom build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the React app using npx
  console.log('Building React app...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
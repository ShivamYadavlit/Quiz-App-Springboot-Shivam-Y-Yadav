#!/usr/bin/env node

// Build script that installs react-scripts globally to avoid permission issues

const { execSync } = require('child_process');

console.log('Starting build process with global react-scripts...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install react-scripts globally
  console.log('Installing react-scripts globally...');
  execSync('npm install -g react-scripts', { stdio: 'inherit' });
  
  // Build the React app
  console.log('Building React app...');
  execSync('react-scripts build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  
  // Try alternative approach: use npx
  try {
    console.log('Trying alternative approach with npx...');
    execSync('npx react-scripts build', { stdio: 'inherit' });
    console.log('Build completed successfully with npx!');
  } catch (error2) {
    console.error('Alternative approach also failed:', error2.message);
    process.exit(1);
  }
}

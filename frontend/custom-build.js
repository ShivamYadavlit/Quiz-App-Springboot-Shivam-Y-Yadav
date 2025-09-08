#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Install dependencies first
const install = spawn('npm', ['ci'], { stdio: 'inherit' });

install.on('close', (code) => {
  if (code !== 0) {
    console.error('Installation failed');
    process.exit(code);
  }
  
  // Run the build
  const build = spawn('node', [
    path.join('node_modules', 'react-scripts', 'bin', 'react-scripts.js'),
    'build'
  ], { stdio: 'inherit' });
  
  build.on('close', (code) => {
    process.exit(code);
  });
});
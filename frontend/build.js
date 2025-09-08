#!/usr/bin/env node

// Simplified build script to avoid permission issues with react-scripts on Render.com

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting simplified build process...');

// Function to run a command and wait for it to complete
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function build() {
  try {
    // Install dependencies
    console.log('Installing dependencies...');
    await runCommand('npm', ['install']);
    
    // Try different approaches to build the React app
    console.log('Attempting to build React app...');
    
    // Approach 1: Try using node directly with react-scripts
    try {
      console.log('Trying approach 1: Direct node execution...');
      const reactScriptsPath = path.join(__dirname, 'node_modules', 'react-scripts', 'bin', 'react-scripts.js');
      await runCommand('node', [reactScriptsPath, 'build']);
      console.log('Build completed successfully with approach 1!');
      return;
    } catch (error) {
      console.log('Approach 1 failed:', error.message);
    }
    
    // Approach 2: Try using npx with full path
    try {
      console.log('Trying approach 2: NPX with full path...');
      await runCommand('npx', ['--yes', 'react-scripts', 'build']);
      console.log('Build completed successfully with approach 2!');
      return;
    } catch (error) {
      console.log('Approach 2 failed:', error.message);
    }
    
    // Approach 3: Try using the .bin path directly
    try {
      console.log('Trying approach 3: Direct .bin execution...');
      const binPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
      await runCommand('node', [binPath, 'build']);
      console.log('Build completed successfully with approach 3!');
      return;
    } catch (error) {
      console.log('Approach 3 failed:', error.message);
    }
    
    // If all approaches fail, throw an error
    throw new Error('All build approaches failed');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

build();
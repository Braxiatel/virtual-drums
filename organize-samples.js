#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🥁 Virtual Drums Sample Organizer');
console.log('================================\n');

const audioDir = './public/audio';
const requiredSamples = [
  'kick.wav',
  'snare.wav', 
  'high-tom.wav',
  'mid-tom.wav',
  'floor-tom.wav',
  'closed-hihat.wav',
  'open-hihat.wav',
  'crash.wav',
  'ride.wav'
];

function checkSamples() {
  console.log('Checking current samples:\n');
  
  requiredSamples.forEach(sample => {
    const filePath = path.join(audioDir, sample);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const status = stats.size > 0 ? '✅' : '❌ (empty)';
      const size = stats.size > 0 ? `(${(stats.size / 1024).toFixed(1)}KB)` : '';
      console.log(`${status} ${sample} ${size}`);
    } else {
      console.log(`❌ ${sample} (missing)`);
    }
  });
}

function copySample(sourcePath, targetName) {
  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Source file not found: ${sourcePath}`);
    return false;
  }
  
  const targetPath = path.join(audioDir, targetName);
  try {
    fs.copyFileSync(sourcePath, targetPath);
    const stats = fs.statSync(targetPath);
    console.log(`✅ Copied ${targetName} (${(stats.size / 1024).toFixed(1)}KB)`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to copy ${targetName}: ${error.message}`);
    return false;
  }
}

// Usage instructions
console.log('INSTRUCTIONS:');
console.log('1. Download 99Sounds drum samples');
console.log('2. Extract them to a folder');
console.log('3. Use this script to copy samples:');
console.log('\nExample usage:');
console.log('node organize-samples.js check                    # Check current status');
console.log('node organize-samples.js copy <source> <target>   # Copy a sample');
console.log('\nExample:');
console.log('node organize-samples.js copy "/path/to/kick_01.wav" kick.wav\n');

// Handle command line arguments
const args = process.argv.slice(2);

if (args[0] === 'check') {
  checkSamples();
} else if (args[0] === 'copy' && args[1] && args[2]) {
  copySample(args[1], args[2]);
} else if (args.length === 0) {
  checkSamples();
} else {
  console.log('Invalid arguments. Use "check" or "copy <source> <target>"');
} 
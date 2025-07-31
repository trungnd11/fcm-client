#!/usr/bin/env node

/* global process */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function showHelp() {
  console.log(`
🔥 FCM RSLib CLI

Usage: fcm-rslib <command> [options]

Commands:
  init-worker              Initialize and generate FCM service worker
  generate                 Generate service worker file
  validate                 Validate existing service worker
  config                   Update Firebase configuration
  help                     Show this help message

Examples:
  fcm-rslib init-worker
  fcm-rslib generate --output ./public/sw.js
  fcm-rslib validate
  fcm-rslib config --config ./firebase-config.json

For more information, visit: https://github.com/your-repo/fcm-rslib
`);
}

function runWorkerScript(command, args = []) {
  const workerScript = join(__dirname, 'fcm-worker.js');

  return new Promise((resolve, reject) => {
    const child = spawn('node', [workerScript, command, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        FCM_RSLIB_INSTALLED: 'true',
      },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function initWorker() {
  console.log('🚀 Initializing FCM Service Worker...\n');

  try {
    // Generate service worker
    console.log('📝 Generating service worker...');
    await runWorkerScript('generate');

    // Validate the generated service worker
    console.log('\n🔍 Validating service worker...');
    await runWorkerScript('validate');

    console.log('\n✅ FCM Service Worker initialized successfully!');
    console.log(
      '📁 Service worker location: ./public/firebase-messaging-sw.js',
    );
    console.log('\n📖 Next steps:');
    console.log('   1. Register the service worker in your app');
    console.log('   2. Request notification permission');
    console.log('   3. Get FCM token and send to your server');
  } catch (error) {
    console.error(
      '\n❌ Failed to initialize FCM Service Worker:',
      error.message,
    );
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (
    !command ||
    command === 'help' ||
    command === '--help' ||
    command === '-h'
  ) {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case 'init-worker':
        await initWorker();
        break;

      case 'generate':
      case 'validate':
      case 'config':
        await runWorkerScript(command, args.slice(1));
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('\nRun "fcm-rslib help" for available commands.');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if this file is executed directly
// Cross-platform check for direct execution
const isDirectExecution = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || 
                         import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` ||
                         process.argv[1].includes('cli.js');

if (isDirectExecution) {
  main();
}

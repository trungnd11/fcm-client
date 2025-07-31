#!/usr/bin/env node

/* global process */

import { execSync } from 'child_process';
import { existsSync, chmodSync } from 'fs';
import { join } from 'path';

console.log('🔧 Setting up FCM RSLib CLI locally...\n');

try {
  // Make CLI script executable
  const cliPath = join(process.cwd(), 'scripts', 'cli.js');
  const workerPath = join(process.cwd(), 'scripts', 'fcm-worker.js');

  if (existsSync(cliPath)) {
    chmodSync(cliPath, '755');
    console.log('✅ Made CLI script executable');
  }

  if (existsSync(workerPath)) {
    chmodSync(workerPath, '755');
    console.log('✅ Made worker script executable');
  }

  // Link package globally for development
  console.log('\n📦 Linking package globally...');
  execSync('pnpm link --global', { stdio: 'inherit' });

  console.log('\n✅ FCM RSLib CLI setup complete!');
  console.log('\n🚀 You can now use:');
  console.log('   fcm-rslib init-worker');
  console.log('   fcm-rslib help');
  console.log('\n💡 To unlink later, run: pnpm unlink --global');
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function generateJWTSecret(): string {
  return crypto.randomBytes(64).toString('hex');
}

function setupEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  // Check if .env.local exists
  const envExists = fs.existsSync(envPath);
  let envContent = '';

  if (envExists) {
    console.log('📄 Found existing .env.local file');
    envContent = fs.readFileSync(envPath, 'utf-8');
  } else {
    console.log('📄 Creating new .env.local file');
  }

  // Check if JWT_SECRET already exists
  if (envContent.includes('JWT_SECRET=')) {
    const jwtSecretMatch = envContent.match(/JWT_SECRET=(.+)/);
    if (jwtSecretMatch && jwtSecretMatch[1].trim() && !jwtSecretMatch[1].includes('your_super_secret')) {
      console.log('✅ JWT_SECRET already exists in .env.local');
      console.log('   Current value:', jwtSecretMatch[1].substring(0, 20) + '...');
      return;
    }
  }

  // Generate new JWT_SECRET
  const jwtSecret = generateJWTSecret();
  console.log('🔑 Generated new JWT_SECRET');

  // Add or update JWT_SECRET
  if (envContent.includes('JWT_SECRET=')) {
    // Update existing JWT_SECRET
    envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${jwtSecret}`);
    console.log('✅ Updated JWT_SECRET in .env.local');
  } else {
    // Add JWT_SECRET if not present
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `\n# JWT Authentication\nJWT_SECRET=${jwtSecret}\nJWT_EXPIRES_IN=7d\n`;
    console.log('✅ Added JWT_SECRET to .env.local');
  }

  // Write to file
  fs.writeFileSync(envPath, envContent, 'utf-8');
  console.log('\n✅ .env.local file updated successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  IMPORTANT: Restart your dev server for changes to take effect!');
  console.log('   Run: npm run dev');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

try {
  setupEnvFile();
  process.exit(0);
} catch (error: any) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}


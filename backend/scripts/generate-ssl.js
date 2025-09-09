const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🔐 Generating self-signed SSL certificates for development...\n');

// Create ssl directory if it doesn't exist
const sslDir = path.join(__dirname, '..', 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
  console.log('📁 Created ssl directory');
}

// Check if OpenSSL is available
try {
  execSync('openssl version', { stdio: 'pipe' });
  console.log('✅ OpenSSL is available');
} catch (error) {
  console.error('❌ OpenSSL is not installed or not in PATH');
  console.log('💡 Please install OpenSSL:');
  console.log('   - Windows: Download from https://slproweb.com/products/Win32OpenSSL.html');
  console.log('   - macOS: brew install openssl');
  console.log('   - Linux: sudo apt-get install openssl');
  process.exit(1);
}

// Generate private key
console.log('🔑 Generating private key...');
try {
  execSync(`openssl genrsa -out "${path.join(sslDir, 'server.key')}" 2048`, { stdio: 'pipe' });
  console.log('✅ Private key generated');
} catch (error) {
  console.error('❌ Failed to generate private key:', error.message);
  process.exit(1);
}

// Generate certificate signing request
console.log('📝 Generating certificate signing request...');
try {
  const csrCommand = `openssl req -new -key "${path.join(sslDir, 'server.key')}" -out "${path.join(sslDir, 'server.csr')}" -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"`;
  execSync(csrCommand, { stdio: 'pipe' });
  console.log('✅ Certificate signing request generated');
} catch (error) {
  console.error('❌ Failed to generate CSR:', error.message);
  process.exit(1);
}

// Generate self-signed certificate
console.log('📜 Generating self-signed certificate...');
try {
  const certCommand = `openssl x509 -req -days 365 -in "${path.join(sslDir, 'server.csr')}" -signkey "${path.join(sslDir, 'server.key')}" -out "${path.join(sslDir, 'server.crt')}"`;
  execSync(certCommand, { stdio: 'pipe' });
  console.log('✅ Self-signed certificate generated');
} catch (error) {
  console.error('❌ Failed to generate certificate:', error.message);
  process.exit(1);
}

// Clean up CSR file
try {
  fs.unlinkSync(path.join(sslDir, 'server.csr'));
  console.log('🧹 Cleaned up temporary files');
} catch (error) {
  console.log('⚠️  Could not clean up CSR file (not critical)');
}

console.log('\n🎉 SSL certificates generated successfully!');
console.log('📁 Files created:');
console.log(`   - ${path.join(sslDir, 'server.key')} (private key)`);
console.log(`   - ${path.join(sslDir, 'server.crt')} (certificate)`);
console.log('\n🚀 You can now start the server with HTTPS:');
console.log('   npm run start:https');
console.log('   npm run dev:https');
console.log('\n⚠️  Note: These are self-signed certificates for development only.');
console.log('   Your browser will show a security warning - this is normal for self-signed certs.');
console.log('   Click "Advanced" and "Proceed to localhost" to continue.');

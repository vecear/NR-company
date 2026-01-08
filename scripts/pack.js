const fs = require('fs');
const path = require('path');
const ChromeExtension = require('crx');

const rootDir = path.join(__dirname, '..');
const manifestPath = path.join(rootDir, 'manifest.json');
const manifest = require(manifestPath);
const version = manifest.version;
const keyPath = path.join(rootDir, 'key.pem');
const distPath = path.join(rootDir, `NR-company-v${version}.crx`);

// Exclude list (folders/files to not include in the package)
// Note: crx load method packages the whole directory. 
// We might need to copy necessary files to a temp dir to exclude node_modules etc. if the folder is dirty.
// However, for this task I will try to pack the root, but commonly one should exclude node_modules.
// Let's create a temp build folder to be clean.

const tempBuildDir = path.join(rootDir, 'build_temp');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Minimal list of files/folders to include
const includeList = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.js',
    'resize-icons.js',
    'theme-detector.js',
    'icon16.png',
    'icon48.png',
    'icon128.png',
    'icon16_dark.png',
    'icon48_dark.png',
    'icon128_dark.png',
    'icon16_light.png',
    'icon48_light.png',
    'icon128_light.png',
    // add any other necessary files here
];

async function pack() {
    try {
        console.log('Preparing build directory...');
        if (fs.existsSync(tempBuildDir)) {
            fs.rmSync(tempBuildDir, { recursive: true, force: true });
        }
        fs.mkdirSync(tempBuildDir);

        const files = fs.readdirSync(rootDir);
        for (const file of files) {
            if (includeList.includes(file) || file.startsWith('icon')) {
                const src = path.join(rootDir, file);
                const dest = path.join(tempBuildDir, file);
                copyRecursiveSync(src, dest);
            }
        }

        console.log('Loading or generating private key...');
        let privateKey;
        if (fs.existsSync(keyPath)) {
            privateKey = fs.readFileSync(keyPath);
            console.log('Existing key found.');
        } else {
            console.log('Generating new key...');
            // We'll let crx generate it if we pass nothing to constructor? 
            // Actually crx requires a private key buffer in load or we generate one.
            // Let's rely on ssh-keygen or similar? No, let's use a mock or try to use node-forge if needed, 
            // but 'crx' package might not auto-generate key easily without input.
            // Wait, standard practice: openssl genrsa -out key.pem 2048
            // I'll assume we can't easily rely on openssl being in path on windows without checking.
            // Let's check if we can generate it via JS or if I should just ask user/assume openssl.
            // Actually, for simplicity, I should have checked if `crx` can generate one.
            // Looking at crx docs (known knowledge), commonly need a key.
            // I will try to generate one using `node:crypto` or just assume I can make one if missing.
            // Let's try to just proceed. If key missing, I might fail.
            // But wait, the task list said "Generate private key".
            // I will cheat and use a simple self-invocation of openssl if available or use a library.
            // NOTE: 'crx' creates signed packages. It needs a key.
        }

        // Setup crx
        const crx = new ChromeExtension({
            privateKey: privateKey
        });

        console.log('Loading extenson from build dir...');
        await crx.load(tempBuildDir);

        if (!privateKey) {
            // If we didn't have a key, we need to save the generated one if crx generated it?
            // Actually crx.load() reads the extension. crx.pack() creates the file.
            // If no privateKey provided to constructor, crx might fail or just create unsigned? 
            // crx module needs privateKey.
            // I will use `crypto` to generate a key if needed.
            const { generateKeyPairSync } = require('crypto');
            const { privateKey: newKey } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
            });
            // crx expects RSA private key. pkcs8 might be fine or pkcs1.
            // Let's try pkcs1 usually for these tools.
            const { privateKey: newKeyColors } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
            });

            privateKey = newKeyColors;
            fs.writeFileSync(keyPath, privateKey);
            console.log('New key generated and saved to key.pem');

            // Re-init crx with new key
            crx.privateKey = privateKey;
        }

        console.log('Packing...');
        const crxBuffer = await crx.pack();

        fs.writeFileSync(distPath, crxBuffer);
        console.log(`Created ${distPath}`);

        // Cleanup
        fs.rmSync(tempBuildDir, { recursive: true, force: true });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

pack();

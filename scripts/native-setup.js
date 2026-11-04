// Runs automatically after `npx cap sync android` (Capacitor hook "capacitor:sync:after").
// Installs: custom Android code (save to Download/PDFCrop, exit), launcher icons,
// storage permission, build number and a fixed signing key.
const fs = require('fs'), path = require('path'), os = require('os');
const root = process.cwd();
const A = path.join(root, 'android');
if (!fs.existsSync(A)) { console.log('[native-setup] no android folder, skipping'); process.exit(0); }

const RES = path.join(A, 'app/src/main/res');
const cp = (s, d) => { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); };
const copyDir = (s, d) => { for (const e of fs.readdirSync(s, { withFileTypes: true })) {
  const a = path.join(s, e.name), b = path.join(d, e.name); e.isDirectory() ? copyDir(a, b) : cp(a, b); } };
const rm = p => fs.rmSync(p, { recursive: true, force: true });

// 1. Java code
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
const jdir = path.join(A, 'app/src/main/java', ...cfg.appId.split('.'));
for (const f of fs.readdirSync(path.join(root, 'native'))) if (f.endsWith('.java')) {
  cp(path.join(root, 'native', f), path.join(jdir, f)); console.log('[native-setup] java:', f); }

// 2. launcher icons (remove Capacitor defaults first)
for (const d of fs.readdirSync(RES)) if (d.startsWith('mipmap-')) rm(path.join(RES, d));
rm(path.join(RES, 'drawable-v24/ic_launcher_foreground.xml'));
rm(path.join(RES, 'drawable/ic_launcher_background.xml'));
rm(path.join(RES, 'values/ic_launcher_background.xml'));
copyDir(path.join(root, 'native/res'), RES);
console.log('[native-setup] icons installed');

// 3. storage permission (Android 9 and older)
const mf = path.join(A, 'app/src/main/AndroidManifest.xml');
let m = fs.readFileSync(mf, 'utf8');
if (!m.includes('WRITE_EXTERNAL_STORAGE')) {
  m = m.replace('</manifest>', '    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />\n</manifest>');
  fs.writeFileSync(mf, m);
}

// 4. version / build number
const run = process.env.GITHUB_RUN_NUMBER || '1';
const gf = path.join(A, 'app/build.gradle');
let g = fs.readFileSync(gf, 'utf8');
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + run).replace(/versionName\s+"[^"]*"/, 'versionName "1.0.' + run + '"');
fs.writeFileSync(gf, g);
const idx = path.join(A, 'app/src/main/assets/public/index.html');
if (fs.existsSync(idx)) fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace('__BUILD__', run));
console.log('[native-setup] build', run);

// 5. fixed debug signing key => every new APK installs over the previous one
const ks = path.join(root, 'native/debug.keystore');
if (fs.existsSync(ks)) { cp(ks, path.join(os.homedir(), '.android', 'debug.keystore')); console.log('[native-setup] signing key installed'); }

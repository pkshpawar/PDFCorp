# PDFCrop APK

Crop Aadhaar, PAN, Ayushman, ABHA and other cards from PDFs/images to PVC card size (85.6 x 54 mm).
Works offline; files never leave your phone. The APK is built automatically by GitHub Actions.

## IMPORTANT (first time only)
Uninstall any old PDFCrop app from your phone first. Older builds were signed with a different key, so Android refuses to install a new APK over them and the old app (old icon, no exit screen) keeps running. From this build on, every new APK installs over the previous one. The app header shows "build N" so you can check you have the newest.

## Get the APK (no Android Studio needed)
1. Create a new GitHub repository and upload everything in this folder (keep the `.github` folder).
2. Open the **Actions** tab > **Build APK** > **Run workflow** (it also runs on every push to `main`).
3. When it finishes (about 5-8 minutes), open the run and download **PdfCrop-apk** from *Artifacts*. Unzip it to get `PdfCrop.apk`.
4. Copy the APK to your phone and install it (allow "Install unknown apps" when asked).

For a download link on the Releases page, push a tag such as `v1.0`: `git tag v1.0 && git push origin v1.0`.

## Saving on Android
Files are saved straight into **Download/PDFCrop** on your phone (open the Files app > Download > PDFCrop).
On Android 9 or older, allow Storage permission for the app in Settings if saving fails.
For many cards use **Save JPEGs as ZIP** or the single multi-page **PDF**.

## Exit message
Pressing Back (or the Exit button) shows for 2 seconds the "जय हिंद" screen with the flag, *Developed by Prakash Pawar* and *Ver 1.0*, then the app closes completely.

## Notes
- This builds a *debug* APK, which installs fine for personal use. For Play Store you need a signed release build.
- Folder: `www/` = the web app, `capacitor.config.json` = app id/name, `assets/icon-only.png` = launcher icon, `native/` = Android code (saving to Download/PDFCrop, exit, launcher icons in `native/res`).
- Build locally instead: `npm install`, download the 4 libs into `www/lib` (see the workflow), `npx cap add android`, `npx cap sync android`, then build in Android Studio.

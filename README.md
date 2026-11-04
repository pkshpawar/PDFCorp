# PdfCrop APK

Crop Aadhaar, PAN, Ayushman, ABHA and other cards from PDFs/images to PVC card size (85.6 x 54 mm).
Works offline; files never leave your phone. The APK is built automatically by GitHub Actions.

## Get the APK (no Android Studio needed)
1. Create a new GitHub repository and upload everything in this folder (keep the `.github` folder).
2. Open the **Actions** tab > **Build APK** > **Run workflow** (it also runs on every push to `main`).
3. When it finishes (about 5-8 minutes), open the run and download **PdfCrop-apk** from *Artifacts*. Unzip it to get `PdfCrop.apk`.
4. Copy the APK to your phone and install it (allow "Install unknown apps" when asked).

For a download link on the Releases page, push a tag such as `v1.0`: `git tag v1.0 && git push origin v1.0`.

## Saving on Android
Save buttons open the Android share sheet: choose **Files / Save to device**, Drive, WhatsApp, etc.
For many cards use **Save JPEGs as ZIP** or the single multi-page **PDF**.

## Notes
- This builds a *debug* APK, which installs fine for personal use. For Play Store you need a signed release build.
- Folder: `www/` = the web app, `capacitor.config.json` = app id/name, `assets/icon-only.png` = launcher icon.
- Build locally instead: `npm install`, download the 4 libs into `www/lib` (see the workflow), `npx cap add android`, `npx cap sync android`, then build in Android Studio.

package com.pdfcrop.app;

import android.content.ContentValues;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/** Saves files into Download/PDFCrop (public Downloads folder). */
@CapacitorPlugin(name = "DownloadSaver")
public class DownloadSaverPlugin extends Plugin {

    @PluginMethod
    public void save(PluginCall call) {
        String name = call.getString("name");
        String data = call.getString("data");
        String mime = call.getString("mime", "application/octet-stream");
        if (name == null || data == null) { call.reject("Missing name or data"); return; }
        try {
            byte[] bytes = Base64.decode(data, Base64.DEFAULT);
            Context ctx = getContext();
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/PDFCrop");
                Uri uri = ctx.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                if (uri == null) throw new Exception("Could not create file in Downloads");
                try (OutputStream os = ctx.getContentResolver().openOutputStream(uri)) { os.write(bytes); }
            } else {
                File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "PDFCrop");
                if (!dir.exists() && !dir.mkdirs()) throw new Exception("Allow Storage permission for PDFCrop in Settings, then retry");
                File f = new File(dir, name);
                try (FileOutputStream os = new FileOutputStream(f)) { os.write(bytes); }
                MediaScannerConnection.scanFile(ctx, new String[]{f.getAbsolutePath()}, null, null);
            }
            JSObject r = new JSObject();
            r.put("path", "Download/PDFCrop/" + name);
            call.resolve(r);
        } catch (Exception e) {
            call.reject(e.getMessage() == null ? "Save failed" : e.getMessage());
        }
    }

    /** Fully closes the app (task removed + process ended). */
    @PluginMethod
    public void exit(PluginCall call) {
        call.resolve();
        getActivity().runOnUiThread(() -> {
            getActivity().finishAndRemoveTask();
            new Handler(Looper.getMainLooper()).postDelayed(() -> System.exit(0), 300);
        });
    }
}

package com.example.memorygameandroid;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ImageDownloader {
    Context context;

    public ImageDownloader(Context context) {
        this.context = context;
    }

    protected boolean downloadImage(String imgURL, File destFile) {
        HttpURLConnection conn = null;
        InputStream in = null;
        OutputStream out = null;

        try {
            URL url = new URL(imgURL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla");

            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                return false;
            }

            in = conn.getInputStream();
            out = new FileOutputStream(destFile);

            byte[] buf = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buf)) != -1) {
                out.write(buf, 0, bytesRead);
            }
            return true;

        } catch (IOException exception) {
            Log.e("download image", String.format("Error: $s", imgURL), exception);
            return false;
        } finally {
            try {
                if (in != null) in.close();
                if (out != null) out.close();
            } catch (Exception exception) {
                Log.e("close connections", "close in and out stream error", exception);
            }
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    protected void cleanFile() {
        new Thread(() -> {
            File dir = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            if (dir != null && dir.isDirectory()) {
                for (File file : dir.listFiles()) {
                    if (file.isFile()) {
                        file.delete();
                    }
                }
            }
        }).start();
    }
}

package cn.rongcloud.imlib.react;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

import java.io.*;

class Utils {
    private static String getPathFromUri(Context context, Uri uri, String fileName) {
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            File file = createTemporalFile(context, inputStream, fileName);
            if (file != null) {
                return file.getPath();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private static File createTemporalFile(Context context, InputStream inputStream, String fileName) throws IOException {
        if (inputStream != null) {
            File target = new File(context.getCacheDir(), fileName);
            OutputStream outputStream = new FileOutputStream(target);
            try {
                byte[] buffer = new byte[1024];
                int read;
                while ((read = inputStream.read(buffer)) > 0) {
                    outputStream.write(buffer, 0, read);
                }
            } finally {
                outputStream.close();
                inputStream.close();
            }
            return target;
        }
        return null;
    }

    static Uri getFileUri(Context context, String s) {
        Uri uri = Uri.parse(s);
        if (s.startsWith("content://")) {
            String[] types = {MediaStore.MediaColumns.DATA, MediaStore.MediaColumns.DISPLAY_NAME};
            Cursor cursor = context.getContentResolver().query(uri, types, null, null, null);
            if (cursor != null) {
                cursor.moveToFirst();
                String path = cursor.getString(cursor.getColumnIndex(types[0]));
                String filename = cursor.getString(cursor.getColumnIndex(types[1]));
                cursor.close();
                if (path == null) {
                    path = Utils.getPathFromUri(context, uri, filename);
                }
                return Uri.parse("file://" + path);
            }
        }
        return uri;
    }
}


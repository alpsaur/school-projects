package com.nus.iss.funsg;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
public class DateUtils {
    public static String formatDateString(String dateString){
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat("MMM dd, yyyy", Locale.getDefault());
        Date date;
        String formattedDate = "";
        try {
            date = inputFormat.parse(dateString);
            if (date != null) {
                formattedDate = outputFormat.format(date);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return formattedDate;
    }
    public static String formatDateStringInHint(String dateString){
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
        Date date;
        String formattedDate = "";
        try {
            date = inputFormat.parse(dateString);
            if (date != null) {
                formattedDate = outputFormat.format(date);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return formattedDate;
    }

    public static String formatDateTimeString(String dateString){
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault());
        Date date;
        String formattedDate = "";
        try {
            date = inputFormat.parse(dateString);
            if (date != null) {
                formattedDate = outputFormat.format(date);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return formattedDate;
    }
}

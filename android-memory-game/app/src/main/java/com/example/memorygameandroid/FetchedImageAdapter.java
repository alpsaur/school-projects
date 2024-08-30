package com.example.memorygameandroid;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

public class FetchedImageAdapter extends ArrayAdapter<File> {

    private final Context context;
    HashMap<Integer, String> selected;
    private OnSelectionChangedListener listener;

    public FetchedImageAdapter(@NonNull Context context) {
        super(context, R.layout.fetched_image_item);
        this.context = context;
        selected = new HashMap<>();
    }

    public void updateDate(int position, String newDate) {

    }

    public View getView(int pos, View view, @NonNull ViewGroup parent) {

        ImageView imageView;
        ImageView tickBox;
        if (view == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(GameActivity.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.fetched_image_item, parent, false);
        }
        File imgFile = getItem(pos);
        imageView = view.findViewById(R.id.fetchedImage);
        tickBox = view.findViewById(R.id.tickBox);

        // Using Glide instead of BitmapFactory.decodeFile to improve performance and avoid race condition
        if (imgFile != null && imgFile.exists()) {
            Glide.with(getContext())
                    .load(imgFile)
                    .into(imageView);
        }

        view.setOnClickListener(v -> {
            if (imageView.getBackground() == null) {
                imageView.setBackground(ContextCompat.getDrawable(context, R.drawable.green_border));
                tickBox.setVisibility(View.VISIBLE);
                //save the image to HashMap
                selected.put(pos, imgFile.getAbsolutePath());
            } else {
                imageView.setBackground(null);
                tickBox.setVisibility(View.INVISIBLE);
                //remove image from hash
                selected.remove(pos);
            }
            if (listener != null) {
                listener.onSelectionChanged(selected.size());
            }
        });
        return view;
    }

    public ArrayList<String> getSelectedImage() {
        return new ArrayList<>(selected.values());
    }

    public interface OnSelectionChangedListener {
        void onSelectionChanged(int selectedCount);
    }

    public void setOnSelectionChangedListener(OnSelectionChangedListener listener) {
        this.listener = listener;
    }

    //after fetch, clear the data in hashmap
    public void clearSelectedImages() {
        selected.clear();
    }


}

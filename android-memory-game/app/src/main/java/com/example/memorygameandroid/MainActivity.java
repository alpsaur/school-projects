package com.example.memorygameandroid;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.webkit.URLUtil;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.GridView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.textfield.MaterialAutoCompleteTextView;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

public class MainActivity extends AppCompatActivity implements FetchedImageAdapter.OnSelectionChangedListener {
    Toolbar toolbar;
    AlertDialog.Builder dlg;
    Button btnFetch;
    Button btnStart;
    MaterialAutoCompleteTextView tvInputURL;
    String inputURL;
    Thread fetchThread;
    GridView gridView;
    ProgressBar progressBar;
    TextView tvProgress;

    FetchedImageAdapter adapter;
    ImageDownloader imgDL;

    File dir;
    AlertDialog.Builder gameModeDlg;

    //volatile variable is used for thread management
    private volatile boolean shouldContinue = true;

    private final String[] imageDownloadUrls = {
            "https://stocksnap.io/",
            "https://stocksnap.io/search/flower",
            "https://www.pexels.com/",
            "https://www.pexels.com/search/nature/",
            "https://pixabay.com/",
            "https://pixabay.com/images/search/travel/"
    };

    // mainHandler is used for thread management, and ensure safe interaction between background thread and UI thread
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private final View.OnClickListener btnFetchOnClickListener = new View.OnClickListener() {
        @Override
        //synchronized keyword is used to control access to critical sections of code by multiple thread
        public synchronized void onClick(View view) {
            inputURL = tvInputURL.getText().toString();
            if (URLUtil.isValidUrl(inputURL)) {
                shouldContinue = false; // Stop any ongoing operations
                if (fetchThread != null && fetchThread.isAlive()) {
                    fetchThread.interrupt();
                    try {
                        fetchThread.join(); // Wait for the current thread to finish
                    } catch (InterruptedException exception) {
                        Log.e("fetch thread", "thread interrupt error", exception);
                    }
                }
                shouldContinue = true; // Allow new operations
                adapter.clear();
                adapter.clearSelectedImages();
                imgDL.cleanFile();
                btnStart.setVisibility(View.INVISIBLE);
                hideKeyboard();
                downloadImages(inputURL);
                progressBar.setProgress(0);
                progressBar.setMax(20);
                progressBar.setVisibility(View.VISIBLE);
                tvProgress.setVisibility(View.VISIBLE);
                tvProgress.setText("Start downloading");
            } else {
                Toast.makeText(MainActivity.this, "Invalid URL, please enter a valid URL", Toast.LENGTH_LONG).show();
            }
        }
    };

    private final View.OnClickListener btnStartOnClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            ArrayList<String> selectedImage = adapter.getSelectedImage();
            Intent intent = GameActivity.getStartIntent(MainActivity.this, selectedImage);
            startActivity(intent);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up Views
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        btnFetch = findViewById(R.id.btnFetch);
        btnFetch.setOnClickListener(btnFetchOnClickListener);
        btnStart = findViewById(R.id.btnStart);
        btnStart.setOnClickListener(btnStartOnClickListener);
        tvProgress = findViewById(R.id.tvProgress);
        progressBar = findViewById(R.id.progressBar);
        tvInputURL = findViewById(R.id.autoTvInputURL);
        gridView = findViewById(R.id.gvImg);
        adapter = new FetchedImageAdapter(this);
        adapter.setOnSelectionChangedListener(this);
        if (gridView != null) {
            gridView.setAdapter(adapter);
        }
        imgDL = new ImageDownloader(MainActivity.this);
        dir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);

        ArrayAdapter<String> autoCompleteAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, imageDownloadUrls);
        tvInputURL.setThreshold(1);
        tvInputURL.setAdapter(autoCompleteAdapter);

        dlg = new AlertDialog.Builder(this);
        dlg.setTitle("Instruction")
                .setMessage("1: Enter a URL and fetch images\n2: Select 6 images\n3: Start Game")
                .setPositiveButton("OK", (dialog, id) -> {
                });

        //Set game mode to normal mode(default)
        SharedPreferences pref = getSharedPreferences("settings", MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();

        gameModeDlg = new AlertDialog.Builder(this);
        gameModeDlg.setTitle("Select a Game mode")
                .setMessage("Notice: We are not responsible for any mental damage caused by Wild Mode")
                .setPositiveButton("Normal Mode",
                        (dialogInterface, i) -> {
                            editor.putString("game_mode", "normal mode");
                            editor.commit();
                        })
                .setNegativeButton("Wild Mode",
                        (dialogInterface, i) -> {
                            editor.putString("game_mode", "wild mode");
                            editor.commit();
                        });

    }

    // Set up option Menu
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.instruction) {
            dlg.show();
            return true;
        } else if (id == R.id.highestScore) {
            Intent intent = new Intent(this, HighestScoresActivity.class);
            startActivity(intent);
            return true;
        } else if (id == R.id.gameMode) {
            gameModeDlg.show();
            return true;
        } else {
            return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onSelectionChanged(int selectedCount) {
        if (selectedCount == 6) {
            btnStart.setEnabled(true);
            btnStart.setVisibility(View.VISIBLE);

        } else if (selectedCount > 6) {
            btnStart.setEnabled(false);
            btnStart.setVisibility(View.INVISIBLE);
            Toast.makeText(this, "Please select 6 pictures", Toast.LENGTH_SHORT).show();
        } else {
            btnStart.setEnabled(false);
            btnStart.setVisibility(View.INVISIBLE);
        }
    }

    protected void downloadImages(String url) {
        fetchThread = new Thread(() -> {
            List<String> selectedImageUrls;
            Log.d("Download doc thread", Thread.currentThread().getName());
            try {
                if (!shouldContinue || Thread.interrupted()) {
                    return;
                }
                Document doc = Jsoup.connect(url).userAgent("Mozilla").get();

                selectedImageUrls = doc.select("img[src$=\".jpg\"], img[src$=\".png\"], img[src]:not([src$=\".\"])")
                        .eachAttr("src")
                        .stream()
                        .filter(src -> src.startsWith("http"))
                        .limit(20)
                        .collect(Collectors.toList());
                processImages(selectedImageUrls);
            } catch (IOException exception) {
                Log.e("Fetch Image", String.format("Error: %s", url), exception);
            }
        }, "Fetch thread");
        fetchThread.start();
    }

    protected void processImages(List<String> imageURLs) {
        Log.d("Download image thread", Thread.currentThread().getName());

        for (int i = 0; i < imageURLs.size(); i++) {
            if (!shouldContinue || Thread.interrupted()) {
                imgDL.cleanFile();
                return;
            }
            String imgURL = imageURLs.get(i);
            String destFileName = "image" + (i + 1) + "-" + UUID.randomUUID().toString();
            File destFile = new File(dir, destFileName);
            if (imgDL.downloadImage(imgURL, destFile)) {
                if (!shouldContinue || Thread.interrupted()) {
                    imgDL.cleanFile();
                    return;
                }
                final int progress = i + 1;
                mainHandler.post(() -> {
                    adapter.add(destFile);
                    updateProgressBar(progress);
                });
            }
        }
        progressBar.setVisibility(View.INVISIBLE);
        tvProgress.setVisibility(View.INVISIBLE);
    }

    private synchronized void updateProgressBar(int progress) {
        progressBar.setProgress(progress);
        tvProgress.setText(String.format(Locale.ENGLISH, "Downloading %d of %d images...", progress, 20));
    }

    public void hideKeyboard() {
        // Get the input method manager
        InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);

        // Find the currently focused view, so we can grab the correct window token from it.
        View view = getCurrentFocus();

        // If no view currently has focus, create a new one, just so we can grab a window token from it.
        if (view == null) {
            view = new View(this);
        }

        // Hide the keyboard
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }
}


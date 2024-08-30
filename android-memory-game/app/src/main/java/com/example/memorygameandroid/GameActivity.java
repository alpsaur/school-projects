package com.example.memorygameandroid;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.Handler;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class GameActivity extends AppCompatActivity {
    private static final String KEY_SELECTED_IMAGES = "selectedImages";

    public static Intent getStartIntent(Context context, ArrayList<String> selectedImages) {
        Intent intent = new Intent(context, GameActivity.class);
        intent.putExtra(KEY_SELECTED_IMAGES, selectedImages);
        return intent;
    }

    private TextView textTimer;
    private long startTimeInMillis;
    private final Handler timerHandler = new Handler();
    private Runnable timerRunnable;
    private ImageButton restartBtn;
    private ImageButton exitBtn;
    private final boolean restartBtnEnabled = true;
    private TextView matchCounter;
    private final Handler handler = new Handler();
    private Runnable hideRestartButtonRunnable;
    private boolean isThreeSecondsElapsed = false;
    private Runnable readyRunnable;
    private Runnable goRunnable;
    private GameImgAdapter adapter;
    private RecyclerView recyclerView;
    private boolean isTimerRunning = false;
    private ExecutorService executorService;
    private CountDownTimer countDownTimer;
    private MediaPlayer mediaPlayer;  // MediaPlayer instance

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_game);

        setFullScreenMode();

        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new GridLayoutManager(this, 3));

        executorService = Executors.newSingleThreadExecutor();

        // Set images source of recyclerView
        List<String> selectedImageFilePaths = getIntent().getStringArrayListExtra(KEY_SELECTED_IMAGES);
        List<GameImage> images = GameImage.createFromFilePaths(selectedImageFilePaths);
        adapter = new GameImgAdapter(this, images, () -> onAllImagesMatched());
        recyclerView.setAdapter(adapter);

        textTimer = findViewById(R.id.timer);
        restartBtn = findViewById(R.id.restart_btn);
        restartBtn.setOnClickListener(view -> {
            if (restartBtnEnabled) {
                resetGame();
            }
        });
        exitBtn = findViewById(R.id.exit_btn);
        exitBtn.setOnClickListener(view -> finish());
        startReadyTimer();
    }

    private void startReadyTimer() {
        textTimer = findViewById(R.id.timer);
        textTimer.setTextColor(getResources().getColor(R.color.green));
        textTimer.setText("READY?");

        // Use executorService to run MediaPlayer on a separate thread
        handler.postDelayed(() -> {
        executorService.execute(() -> {
            mediaPlayer = MediaPlayer.create(GameActivity.this, R.raw.readygo);
            mediaPlayer.start();
        });
        }, 300);

        readyRunnable = () -> {
            textTimer.setText("SET!");

            goRunnable = () -> startTimer();
            handler.postDelayed(goRunnable, 1000);
        };
        handler.postDelayed(readyRunnable, 1500);
    }

    private void startTimer() {
        adapter.setClickable(true);
        startTimeInMillis = System.currentTimeMillis();
        isTimerRunning = true;
        textTimer.setTextColor(getResources().getColor(R.color.red));

        timerRunnable = new Runnable() {
            @Override
            public void run() {
                if (isTimerRunning) {
                    long millis = System.currentTimeMillis() - startTimeInMillis;
                    int seconds = (int) (millis / 1000);
                    int tenths = (int) ((millis % 1000) / 100);
                    textTimer.setText(String.format(Locale.getDefault(), "%d.%d", seconds, tenths));
                    timerHandler.postDelayed(this, 100);
                }
            }
        };
        timerHandler.post(timerRunnable);
    }

    private void onAllImagesMatched() {
        isTimerRunning = false;
        String res = textTimer.getText().toString();
        double time = Double.parseDouble(res);
        double maxTime = 80.0;
        double score = Math.max(0, 100 - (time / maxTime) * 100);
        String formattedScore = String.format("%.1f", score);
        showGameResultDialog(formattedScore);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        isTimerRunning = false;
        handler.removeCallbacks(readyRunnable);
        handler.removeCallbacks(goRunnable);
        timerHandler.removeCallbacks(timerRunnable);
        executorService.shutdown();

        // Release the MediaPlayer when the activity is destroyed
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        setFullScreenMode();
    }

    private void setFullScreenMode() {
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

    private void resetGame() {
        // reset timer
        isTimerRunning = false;
        timerHandler.removeCallbacks(timerRunnable);
        handler.removeCallbacks(readyRunnable);
        handler.removeCallbacks(goRunnable);
        handler.removeCallbacks(hideRestartButtonRunnable);
        isThreeSecondsElapsed = false;
        setFullScreenMode();
        // reset counter
        matchCounter = findViewById(R.id.match_counter);
        matchCounter.setText(R.string.initial_match_count);
        // reset game
        recyclerView = findViewById(R.id.recycler_view);
        List<GameImage> images = GameImage.createFromFilePaths(getIntent().getStringArrayListExtra(KEY_SELECTED_IMAGES));
        adapter = new GameImgAdapter(this, images, () -> onAllImagesMatched());
        recyclerView.setAdapter(adapter);
        adapter.setClickable(false);
        startReadyTimer();
    }

    private void deleteDownloadedImages() {
        File downloadsDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        if (downloadsDir != null && downloadsDir.isDirectory()) {
            for (File file : downloadsDir.listFiles()) {
                if (file.isFile()) {
                    file.delete();
                }
            }
        }
    }

    private void showGameResultDialog(String score) {
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Game Over");
        String message;
        message = "You Win!\nScore: " + score;

        builder.setMessage(message);
        builder.setPositiveButton("Play Again", (dialog, which) -> {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
            recordScoreAsync(score);
            resetGame();
            if (countDownTimer != null) {
                countDownTimer.cancel();
            }
            dialog.dismiss();
        });
        builder.setNegativeButton("Back(4)", (dialog, which) -> {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
            recordScoreAsync(score);
            // delete photo
            new Thread(() -> deleteDownloadedImages()).start();
            Intent intent = new Intent(GameActivity.this, MainActivity.class);
            intent.putExtra("score", score);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
            finish();
        });
        AlertDialog dialog = builder.create();
        dialog.setCancelable(false);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();
        final Button negativeButton = dialog.getButton(DialogInterface.BUTTON_NEGATIVE);
        countDownTimer = new CountDownTimer(4000, 1000) {
            public void onTick(long millisUntilFinished) {
                negativeButton.setText("Back (" + millisUntilFinished / 1000 + ")");
            }

            public void onFinish() {
                if (dialog.isShowing()) {
                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                    recordScoreAsync(score);
                    // delete photo
                    new Thread(() -> deleteDownloadedImages()).start();
                    Intent intent = new Intent(GameActivity.this, MainActivity.class);
                    intent.putExtra("score", score);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent);
                    finish();
                    dialog.dismiss();
                }
            }
        }.start();
    }

    private void recordScoreAsync(String score) {
        executorService.execute(() -> recordScore(score));
    }

    private void recordScore(String score) {
        SharedPreferences sharedPreferences = getSharedPreferences("GameScores", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        // Get the current scores
        List<Double> scores = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            String savedScore = sharedPreferences.getString("score" + i, null);
            if (savedScore != null) {
                scores.add(Double.parseDouble(savedScore));
            }
        }
        // Add the new score
        double newScore = Double.parseDouble(score);
        scores.add(newScore);
        Collections.sort(scores, Collections.reverseOrder());
        if (scores.size() > 5) {
            scores = scores.subList(0, 5);
        }
        // Save the latest 5 scores
        for (int i = 0; i < scores.size(); i++) {
            editor.putString("score" + i, String.valueOf(scores.get(i)));
        }
        editor.apply();
    }
}

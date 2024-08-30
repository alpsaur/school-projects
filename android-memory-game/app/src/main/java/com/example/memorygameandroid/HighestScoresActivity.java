package com.example.memorygameandroid;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class HighestScoresActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_highest_scores);

        TextView scoresTextView = findViewById(R.id.scoresTextView);

        // Get the latest 5 scores from SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("GameScores", MODE_PRIVATE);
        List<String> scores = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            String score = sharedPreferences.getString("score" + i, null);
            if (score != null) {
                scores.add(score);
            }
        }

        // Sort the scores in descending order
        Collections.sort(scores, (s1, s2) -> Double.compare(Double.parseDouble(s2), Double.parseDouble(s1)));

        // Display the scores
        StringBuilder scoresText = new StringBuilder();
        if (scores.isEmpty()) {
            scoresText.append("No scores recorded.");
        } else {
            for (int i = 0; i < scores.size(); i++) {
                scoresText.append("Rank ").append(i + 1).append(": ")
                        .append("\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t")
                        .append(scores.get(i))
                        .append("\n\n");
            }
        }
        scoresTextView.setText(scoresText.toString());
    }
}
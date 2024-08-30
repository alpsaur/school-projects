package com.nus.iss.funsg;

import android.os.Bundle;
import android.os.Handler;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class WordSelectorActivity extends AppCompatActivity {
    private ChipGroup chipGroup;
    private RadioGroup radioGroup;
    private Button submitButton;
    private FrameLayout reloadBtn;
    private List<String> selectedWords;

    private Map<String, String> keywordSentence;



    private TextView animatedTextView;
    private String[] sentences = {
            "How should we get to know you?",
            "Happy to see your personality description.",
            "Enjoy your selection!"
    };
    private int currentSentenceIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_word_selector);

        animatedTextView = findViewById(R.id.animatedTextView);

        radioGroup=findViewById(R.id.radio_btn_group);
        radioGroup.setOrientation(RadioGroup.VERTICAL);

        submitButton = findViewById(R.id.submitButton);
        selectedWords = new ArrayList<>();

        reloadBtn=findViewById(R.id.reload_btn_container);
        reloadBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectedWords.clear();
                keywordSentence.clear();
                fetchSentence();

            }
        });

        Button skipBtn=findViewById(R.id.skipButton);
        skipBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        fetchSentence();

        final Animation slideIn = AnimationUtils.loadAnimation(this, R.anim.slide_in_right);
        final Animation fadeOut = AnimationUtils.loadAnimation(this, R.anim.fade_out);
        showNextSentence(slideIn, fadeOut);

        setupSubmitButton();
    }
    private void setupChips() {
        radioGroup.removeAllViews();
        for(Map.Entry<String, String> entry : keywordSentence.entrySet()){

            String value = entry.getValue();
            String key = entry.getKey();
            SpannableString spannableString = new SpannableString(value);
            int startIndex = value.indexOf(key);
            if (startIndex != -1) {
                int endIndex = startIndex + key.length();
                spannableString.setSpan(new UnderlineSpan(), startIndex, endIndex, 0);
            }

            RadioButton radioButton = new RadioButton(this);
            radioButton.setText(spannableString);
            //radioButton.setText(entry.getValue());
            radioButton.setTextColor(getResources().getColor(R.color.darkblue));
            radioButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
            radioButton.setBackgroundColor(getResources().getColor(R.color.white));
            radioButton.setBackgroundResource(R.drawable.radio_button_background);
            radioButton.setButtonDrawable(android.R.color.transparent);
            radioButton.setPadding(90, 22, 40, 22);

            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, 0, 12);
            radioButton.setLayoutParams(params);

            radioButton.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    if (isChecked) {
                        selectedWords.clear();
                        selectedWords.add(entry.getKey());
                    }
                }
            });
            radioGroup.addView(radioButton);
        }

    }
    private void setupSubmitButton() {
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendSelection();

            }
        });
    }
    private void sendSelection(){
        AuthPredictMBTIRequest authPredictMBTIRequest=new AuthPredictMBTIRequest(selectedWords);
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.submitMBTIWords(authPredictMBTIRequest).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()){
                    if(selectedWords.size()==1){
                        Toast.makeText(WordSelectorActivity.this, "Predict successfully", Toast.LENGTH_LONG).show();
                        finish();
                    }
                    else{
                        Toast.makeText(WordSelectorActivity.this, "Well, nothing selected..", Toast.LENGTH_LONG).show();
                        finish();
                    }
                }
                else {
                    Toast.makeText(WordSelectorActivity.this, "Submit failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("submitOnFailure", "onFailure: ", t);
            }
        });
    }
    private void fetchSentence(){
        Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getMBTISentence().enqueue(new Callback<Map<String, String>>() {
            @Override
            public void onResponse(Call<Map<String, String>> call, Response<Map<String, String>> response) {
                if (response.isSuccessful()){
                    keywordSentence = response.body();
                    setupChips();
                }else {
                    Log.e("ResponseError", "Failed to load: " + response.message());
                    Toast.makeText(WordSelectorActivity.this, "Failed to load sentence", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<Map<String, String>> call, Throwable t) {
                Log.e("AcquireFailure", "Failed to get MBTI: " + t.getMessage(), t);
            }
        });
    }

    private void showNextSentence(final Animation slideIn, final Animation fadeOut){
        if (currentSentenceIndex < sentences.length) {
            animatedTextView.setText(sentences[currentSentenceIndex]);
            animatedTextView.startAnimation(slideIn);

            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    animatedTextView.startAnimation(fadeOut);
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            currentSentenceIndex++;
                            showNextSentence(slideIn, fadeOut);
                        }
                    }, fadeOut.getDuration());
                }
            }, 2000); // 2-second delay before fading out
        } else {
            //chipGroup.setVisibility(View.VISIBLE);
        }
    }
}
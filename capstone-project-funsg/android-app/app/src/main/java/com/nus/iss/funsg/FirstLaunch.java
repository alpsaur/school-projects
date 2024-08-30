package com.nus.iss.funsg;

import android.content.Intent;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class FirstLaunch extends AppCompatActivity {
    private TextView previewText;
    private TextView loginText;
    private Button signInBtn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_first_launch);
        previewText = findViewById(R.id.preview_text);
        previewText.setPaintFlags(previewText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);

        loginText=findViewById(R.id.login_text);
        loginText.setPaintFlags(loginText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);

        signInBtn=findViewById(R.id.sign_up_btn);
        signInBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(FirstLaunch.this,FirstLaunchRegister.class);
                startActivity(intent);

            }
        });

        loginText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(FirstLaunch.this, FirstLaunchLogin.class);
                startActivity(intent);

            }
        });

        previewText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                UserLoginStatus.savePreviewStatus(FirstLaunch.this,true);
                Intent intent = new Intent(FirstLaunch.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });

    }
}
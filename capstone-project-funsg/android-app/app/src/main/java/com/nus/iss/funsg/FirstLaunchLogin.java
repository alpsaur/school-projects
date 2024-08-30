package com.nus.iss.funsg;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class FirstLaunchLogin extends AppCompatActivity {
    private ImageButton backBtn;
    private Button loginBtn;
    private EditText emailText;
    private EditText passwordText;
    private AuthService authService;

    private String email;
    private String password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_first_launch_login);

        backBtn=findViewById(R.id.back_button_login);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        emailText=findViewById(R.id.email_text_login);
        passwordText=findViewById(R.id.password_text_login);
        loginBtn=findViewById(R.id.login_btn);

        Retrofit retrofit = RetrofitClient.getClientNoToken(IPAddress.ipAddress);
        authService = retrofit.create(AuthService.class);

        loginBtn.setOnClickListener(view -> {
            email = emailText.getText().toString();
            password = passwordText.getText().toString();

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "please fill all field", Toast.LENGTH_SHORT).show();
            } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show();
            } else if (password.length() < 6) {
                Toast.makeText(this, "Password must be more than 6 characters", Toast.LENGTH_SHORT).show();
            }else {
                login(new AuthLoginRequest(email, password));
            }
        });
    }
    private void login(AuthLoginRequest authLoginRequest){
        Call<AuthLoginResponse> call=authService.login(authLoginRequest);
        call.enqueue(new Callback<AuthLoginResponse>(){
            @Override
            public void onResponse(Call<AuthLoginResponse> call, Response<AuthLoginResponse> response){
                if (response.isSuccessful()){
                    AuthLoginResponse authLoginResponse=response.body();
                    if(authLoginResponse!=null){
                        String token = authLoginResponse.getToken();
                        String username=authLoginResponse.getUserName();

                        Log.d("Login", "Token: " + token);
                        Log.d("Login", "Username: " + username);
                        Toast.makeText(FirstLaunchLogin.this,"Login successfully",Toast.LENGTH_SHORT).show();


                        Executor executor = Executors.newSingleThreadExecutor();
                        executor.execute(() -> {
                            UserLoginStatus.saveLoginStatus(FirstLaunchLogin.this,true);
                            UserLoginStatus.saveUserInfo(FirstLaunchLogin.this,token,username,email);

                            runOnUiThread(() -> {
                                Intent intent = new Intent(FirstLaunchLogin.this, MainActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                finish();
                            });
                        });
                    }
                }
                else {
                    Toast.makeText(FirstLaunchLogin.this,"Login failed, please check your email and password"
                    ,Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<AuthLoginResponse>call, Throwable t){
                Toast.makeText(FirstLaunchLogin.this, "Please check your Internet", Toast.LENGTH_SHORT).show();
                Log.e("Login", "onFailure: ", t);
            }
        });
    }
}
package com.nus.iss.funsg;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.Callback;
import retrofit2.Response;

public class FirstLaunchRegister extends AppCompatActivity {
    private ImageButton backBtn;
    private Button signUpBtn;
    private EditText usernameText;
    private EditText emailText;
    private EditText passwordText;
    private AuthService authService;
    private String username;
    private String email;
    private String password;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_first_launch_register);

        backBtn=findViewById(R.id.back_button_register);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        usernameText=findViewById(R.id.username_text);
        emailText=findViewById(R.id.email_text);
        passwordText=findViewById(R.id.password_text);
        signUpBtn=findViewById(R.id.sign_up_submit_btn);

        Retrofit retrofit = RetrofitClient.getClientNoToken(IPAddress.ipAddress);
        authService = retrofit.create(AuthService.class);

        signUpBtn.setOnClickListener(view -> {
            username = usernameText.getText().toString();
            email = emailText.getText().toString();
            password = passwordText.getText().toString();

            if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "please fill all field", Toast.LENGTH_SHORT).show();
            } else if (username.length() > 30) {
                Toast.makeText(this, "Username must be at most 30 characters", Toast.LENGTH_SHORT).show();
            } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show();
            } else if (password.length() < 6) {
                Toast.makeText(this, "Password must be more than 6 characters", Toast.LENGTH_SHORT).show();
            } else {
                signUp(new AuthSignUpRequest(username, email, password));
            }
        });
    }
    private void signUp(AuthSignUpRequest signUpRequest){
        Call<AuthSignUpResponse> call = authService.signUp(signUpRequest);
        call.enqueue(new Callback<AuthSignUpResponse>() {
            @Override
            public void onResponse(Call<AuthSignUpResponse> call, Response<AuthSignUpResponse> response) {
                if (response.isSuccessful()) {
                    AuthSignUpResponse signUpResponse = response.body();
                    if (signUpResponse != null) {
                        String token = signUpResponse.getToken();
                        Log.d("Register", "Token: " + token);
                        Toast.makeText(FirstLaunchRegister.this,"successfully",Toast.LENGTH_SHORT).show();


                        //after register successfully, save the token,and save the user info and to the main activity
                        Executor executor = Executors.newSingleThreadExecutor();
                        executor.execute(() -> {
                            UserLoginStatus.saveLoginStatus(FirstLaunchRegister.this,true);
                            UserLoginStatus.saveUserInfo(FirstLaunchRegister.this,token,username,email);
                            uploadDefaultImage(token);
                            runOnUiThread(() -> {
                                Intent intent = new Intent(FirstLaunchRegister.this, MainActivity.class);
                                intent.putExtra("newUser",true);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                finish();
                            });
                        });

                    }
                } else {
                    Toast.makeText(FirstLaunchRegister.this, "Register failed: user has already exist. ErrorCode: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthSignUpResponse> call, Throwable t) {
                Toast.makeText(FirstLaunchRegister.this, "Please check your Internet", Toast.LENGTH_SHORT).show();
                Log.e("Register", "onFailure: ", t);
            }
        });

    }
    private void uploadDefaultImage(String token){
        int resourceId = R.drawable.default_profile_image;
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), resourceId);
        File file = convertBitmapToFile(bitmap);
        RequestBody requestFile = RequestBody.create(MediaType.parse("image/png"), file);
        MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);
        AuthService authService = RetrofitClient.getClient(IPAddress.ipAddress,token).create(AuthService.class);
        authService.uploadUserImage(body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()){
                    Log.d("uploadUserImageSuccess", "Image upload successful: " + response.message());
                }else {
                    Log.e("uploadUserImageError", "Image upload failed: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("uploadUserImageFailure", "Image upload error: ", t);
            }
        });
    }
    private File convertBitmapToFile(Bitmap bitmap){
        File file = new File(getCacheDir(), "default_profile_image.png");
        try {
            file.createNewFile();
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, bos);
            byte[] bitmapData = bos.toByteArray();
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(bitmapData);
            fos.flush();
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }
}
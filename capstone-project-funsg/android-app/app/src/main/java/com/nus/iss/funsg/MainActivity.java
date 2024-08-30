package com.nus.iss.funsg;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Paint;
import android.os.Bundle;
import android.os.TestLooperManager;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

public class MainActivity extends AppCompatActivity{

    private BottomNavigationView bottomNavigationView;
    private FragmentManager fragmentManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!UserLoginStatus.isLoggedIn(this) && !UserLoginStatus.isPreview(this)){
            Intent intent = new Intent(this,FirstLaunch.class);
            startActivity(intent);
            finish();
        }
        else if(UserLoginStatus.isLoggedIn(this)){
            boolean isNewUser=getIntent().getBooleanExtra("newUser",false);
            if(isNewUser){
                Intent intent =new Intent(this, WordSelectorActivity.class);
                startActivity(intent);
            }
            setContentView(R.layout.activity_main);
            bottomNavigationView = findViewById(R.id.bottom_navigation);
            fragmentManager = getSupportFragmentManager();
            //noinspection deprecation
            bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                    Fragment selectedFragment = null;

                    int itemId = item.getItemId();
                    if (itemId == R.id.nav_home_page) {
                        selectedFragment = new NavHomeFragment();
                    } else if (itemId == R.id.nav_person_page) {
                        selectedFragment = new NavPersonFragment();
                    }

                    if (selectedFragment != null) {
                        fragmentManager.beginTransaction().replace(R.id.fragment_container, selectedFragment).commit();
                    }
                    return true;
                }
            });
            bottomNavigationView.setSelectedItemId(R.id.nav_home_page);
        }
        else if (!UserLoginStatus.isLoggedIn(this) &&UserLoginStatus.isPreview(this)) {
            setContentView(R.layout.activity_main);
            bottomNavigationView = findViewById(R.id.bottom_navigation);
            fragmentManager = getSupportFragmentManager();
            //noinspection deprecation
            bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                    Fragment selectedFragment = null;

                    int itemId = item.getItemId();
                    Bundle bundle = new Bundle();
                    bundle.putBoolean("isPreview", true);


                    if (itemId == R.id.nav_home_page) {
                        selectedFragment = new NavHomeFragment();
                        selectedFragment.setArguments(bundle);
                    } else if (itemId == R.id.nav_person_page) {
                        //need to change to make a toast
                        Toast.makeText(MainActivity.this,
                                "You need to log in to access this page.",
                                Toast.LENGTH_SHORT).show();
                        Intent intent=new Intent(MainActivity.this,FirstLaunch.class);
                        startActivity(intent);
                        finish();
                        return false;

                    }

                    if (selectedFragment != null) {
                        fragmentManager.beginTransaction().replace(R.id.fragment_container, selectedFragment).commit();
                    }
                    return true;
                }
            });
            bottomNavigationView.setSelectedItemId(R.id.nav_home_page);


        }
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        UserLoginStatus.savePreviewStatus(this, false);
    }
}
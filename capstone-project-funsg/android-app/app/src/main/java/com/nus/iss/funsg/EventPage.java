package com.nus.iss.funsg;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.location.Address;
import android.location.Geocoder;
import android.os.AsyncTask;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.Manifest;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.CameraUpdateFactory;

import org.w3c.dom.Text;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class EventPage extends AppCompatActivity implements OnMapReadyCallback {
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private GoogleMap mMap;
    private LatLng defaultLatLng = new LatLng(1.28679, 103.85379);
    private ExecutorService executorService;
    private Handler handler;

    private ImageView eventImage;
    private TextView eventName;
    private TextView eventDate;
    private TextView eventLocation,eventLocationAddress;
    private TextView eventDescription;
    private TextView groupName;
    private TextView goingNumber;

    private ImageView hostImage;
    private Button joinBtn;
    private Thread bgThread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_page);
        long eventId = getIntent().getLongExtra("eventId",-1L);

        eventName = findViewById(R.id.event_name);
        eventDate = findViewById(R.id.event_date);
        eventLocation = findViewById(R.id.event_location_name);
        eventLocationAddress=findViewById(R.id.event_location_address);
        groupName = findViewById(R.id.group_name);
        eventDescription = findViewById(R.id.event_description);
        eventImage = findViewById(R.id.event_image);
        hostImage = findViewById(R.id.host_image);
        goingNumber=findViewById(R.id.going);
        joinBtn=findViewById(R.id.join_event_btn);


        setNormalJoin(eventId);
        checkIfJoined(eventId);

        if(eventId!=-1L){
            fetchEventDetails(eventId);
        }


        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE);
        } else {
            initMap();
        }
        executorService = Executors.newSingleThreadExecutor();
        handler = new Handler(Looper.getMainLooper());
    }
    private void setNormalJoin(long eventId){
        if(UserLoginStatus.isPreview(this)){
            joinBtn.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(EventPage.this, R.color.grey)));
            joinBtn.setText("Preview Mode");
            joinBtn.setClickable(false);
        }
        else {
            joinBtn.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(EventPage.this, R.color.darkblue)));
            joinBtn.setText("Join and RSVP");
            joinBtn.setFocusable(false);
            joinBtn.setClickable(true);
            joinBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    joinEvent(eventId);
                }
            });
        }
    }

    private void checkIfJoined(long eventId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getEventsJoined().enqueue(new Callback<List<AuthEventsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    List<AuthEventsResponse> joinedEvent=response.body();
                    bgThread=new Thread(new Runnable() {
                        @Override
                        public void run() {
                            for(int i= 0; i<joinedEvent.size();i++){
                                if(eventId==joinedEvent.get(i).getId()){
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            joinBtn.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(EventPage.this, R.color.grey)));
                                            joinBtn.setText("Joined");
                                            joinBtn.setFocusable(true);
                                            joinBtn.setOnClickListener(new View.OnClickListener() {
                                                @Override
                                                public void onClick(View view) {
                                                    showExitEventDialog(eventId);
                                                }
                                            });
                                        }
                                    });
                                    break;
                                }
                            }
                        }
                    });
                    bgThread.start();
                }
                else{
                    Log.e("response error", "Error reading error body"+ response.message());
                }
            }

            @Override
            public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });
    }
    private void showExitEventDialog(long eventId){
        new AlertDialog.Builder(this)
                .setTitle("Quit Event")
                .setMessage("Do you want to quit this event?")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        quitEvent(eventId);
                    }
                })
                .setNegativeButton("No", null)
                .show();
    }
    private void quitEvent(long eventId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.quitEvent(eventId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(EventPage.this, "You have exit this event", Toast.LENGTH_SHORT).show();
                setNormalJoin(eventId);
                fetchEventDetails(eventId);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });
    }
    private void joinEvent(long eventId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.joinEvent(eventId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(EventPage.this, "Join successfully!", Toast.LENGTH_SHORT).show();
                checkIfJoined(eventId);
                fetchEventDetails(eventId);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });
    }

    private void fetchEventDetails(long eventId){
        Retrofit retrofit=RetrofitClient.getClientNoToken(IPAddress.ipAddress);
        AuthService authService=retrofit.create(AuthService.class);
        Call<AuthEventsResponse> call = authService.getEventDetails(eventId);
        call.enqueue(new Callback<AuthEventsResponse>() {
            @Override
            public void onResponse(Call<AuthEventsResponse> call, Response<AuthEventsResponse> response) {
                if (response.isSuccessful() && response.body() != null){
                    AuthEventsResponse event=response.body();
                    updateUI(event);
                    showEventLocationOnMap(event.getLocation());
                }
                else {
                    Log.e("EventResponseError", "Failed to load event: " + response.message());
                    Toast.makeText(EventPage.this, "Failed to load events", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthEventsResponse> call, Throwable t) {
                Log.e("EventAcquireFailure", "Failed to load event: " + t.getMessage(), t);
                Toast.makeText(EventPage.this, "Error fetching event", Toast.LENGTH_SHORT).show();
            }
        });
    }


    private void updateUI(AuthEventsResponse event){
        eventName.setText(event.getName());
        eventDate.setText("From  " +DateUtils.formatDateTimeString(event.getStart()) + "\nTo       " + DateUtils.formatDateTimeString(event.getEnd()));
        try{
            String[] locationInfo = event.getLocation().split(",", 2);
            eventLocation.setText(locationInfo[0].trim());
            eventLocationAddress.setText(locationInfo[1].trim());
        }catch (Exception e){}
        groupName.setText(event.getGroupName());
        eventDescription.setText(event.getDescription());
        goingNumber.setText("Going("+event.getEventParticipants().size()+")");

        Glide.with(this).load(event.getProfileImagePath()).into(eventImage);
        //set host photo
        Glide.with(this).load(event.getCreatedBy().getProfileImage()).into(hostImage);

        //set participants photo;
        ImageView person1=findViewById(R.id.person_1);
        ImageView person2=findViewById(R.id.person_2);
        ImageView person3=findViewById(R.id.person_3);
        ImageView person4=findViewById(R.id.person_4);
        ImageView person5=findViewById(R.id.person_5);
        List<ImageView> personList=new ArrayList<>();
        personList.add(person1);
        personList.add(person2);
        personList.add(person3);
        personList.add(person4);
        personList.add(person5);
        //clean the image
        for (ImageView person : personList) {
            person.setImageDrawable(null);
        }
        for(int i =0;i<event.getEventParticipants().size();i++){
            if(i<5){
                Glide.with(this).load(event.getEventParticipants().get(i).getProfileImage()).into(personList.get(i));
            }
        }
        TextView goingNote=findViewById(R.id.going_note);
        if(event.getEventParticipants().size()>=5){
            goingNote.setVisibility(TextView.VISIBLE); //set visible
        }
    }
    private void showEventLocationOnMap(String locationName){
        //locationName="Merlion Park";
        executeGeocodeTask(locationName, 0);
    }


    private void initMap() {
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.mapview);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                initMap();
            }
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        /*  TODO set google map cant move alter method : create custom scrollview */
        mMap.getUiSettings().setScrollGesturesEnabled(false);
    }

    private void executeGeocodeTask(String locationName, int retryCount){
        executorService.submit(() -> {
            Geocoder geocoder = new Geocoder(EventPage.this, Locale.getDefault());
            LatLng latLng = null;
            try {
                List<Address> addresses = geocoder.getFromLocationName(locationName, 1);
                if (addresses != null && !addresses.isEmpty()) {
                    Address address = addresses.get(0);
                    latLng = new LatLng(address.getLatitude(), address.getLongitude());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            LatLng finalLatLng = latLng;
            handler.post(() -> {
                if (finalLatLng != null && mMap != null) {
                    handler.postDelayed(() -> {
                        mMap.addMarker(new MarkerOptions().position(finalLatLng).title(locationName));
                        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(finalLatLng, 15));
                        //mMap.animateCamera(CameraUpdateFactory.zoomIn());
                    }, 30);
                }
                else {
                    if (retryCount < 3) {
                        try{
                            //handler.postDelayed(() -> executeGeocodeTask(locationName, retryCount + 1), 3000);
                        }
                        catch (Exception e){}

                    } else {
                        if (mMap != null) {
                            mMap.addMarker(new MarkerOptions().position(defaultLatLng).title("Default Location"));
                            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(defaultLatLng, 15));
                        }
                    }
                }
            });
        });
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (executorService != null) {
            executorService.shutdown();
        }
    }
}
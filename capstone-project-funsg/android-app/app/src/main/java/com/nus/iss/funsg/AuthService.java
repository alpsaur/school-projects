package com.nus.iss.funsg;
import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface AuthService {
    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("auth/signup")
    Call<AuthSignUpResponse> signUp(@Body AuthSignUpRequest authSignUpRequest);

    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("auth/login")
    Call<AuthLoginResponse> login(@Body AuthLoginRequest authRequest);

    @Headers({
            "User-Agent: Android"
    })
    @POST("auth/logout")
    Call<Void> logout();


    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("groups")
    Call<Void> createGroup(@Body AuthCreateGroupRequest request);

    @Multipart
    @Headers({
            "User-Agent: Android"
    })
    @POST("groups/groupImage")
    Call<ResponseBody> uploadImage(@Part MultipartBody.Part file);


    @Headers({
            "User-Agent: Android"
    })
    @GET("categories/{categoryId}/groups")
    Call<List<AuthGroupsResponse>> getGroups(@Path("categoryId") Long categoryId);

    @Headers({
            "User-Agent: Android"
    })
    @GET("groups/{groupId}")
    Call<AuthGroupsResponse> getGroupDetails(@Path("groupId") long groupId);

    @Headers({
            "User-Agent: Android"
    })
    @GET("events")
    Call<List<AuthEventsResponse>> getEvents();

    @Headers({
            "User-Agent: Android"
    })
    @GET("events/recommendations")
    Call<List<AuthEventsResponse>> getEventsRecommendations();

    @Headers({
            "User-Agent: Android"
    })
    @GET("events/{eventId}")
    Call<AuthEventsResponse> getEventDetails(@Path("eventId") long eventId);

    @Headers({
            "User-Agent: Android"
    })
    @GET("search")
    Call<List<AuthEventsResponse>> searchEvents(@Query("query") String query,
                                                @Query("client") String client);

    @Headers({
            "User-Agent: Android"
    })
    @GET("users/groups")
    Call<List<AuthGroupsResponse>> getGroupsJoined();

    @Headers({
            "User-Agent: Android"
    })
    @GET("users/profile")
    Call<AuthUserProfileResponse> getUserProfile();


    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("events/{groupId}/events")
    Call<AuthEventsResponse> createEvent(@Path("groupId") long groupId, @Body AuthCreateEventRequest eventRequest);


    @Headers({
            "User-Agent: Android"
    })
    @GET("users/events")
    Call<List<AuthEventsResponse>> getEventsJoined();

    @Headers({
            "User-Agent: Android"
    })
    @GET("events/{groupId}/events")
    Call<List<AuthEventsResponse>> getGroupEvents(@Path("groupId") long groupId);

    @Headers({
            "User-Agent: Android"
    })
    @POST("groups/{groupId}/join")
    Call<Void> joinGroup(@Path("groupId") long groupId);

    @Headers({
            "User-Agent: Android"
    })
    @DELETE("groups/{groupId}/exit")
    Call<Void> quitGroup(@Path("groupId") long groupId);

    @Headers({
            "User-Agent: Android"
    })
    @POST("events/{eventId}/register")
    Call<Void> joinEvent(@Path("eventId") long eventId);

    @Headers({
            "User-Agent: Android"
    })
    @DELETE("events/{eventId}/exit")
    Call<Void> quitEvent(@Path("eventId") long eventId);



    @Multipart
    @Headers({
            "User-Agent: Android"
    })
    @POST("users/profileImage")
    Call<Void> uploadUserImage(@Part MultipartBody.Part file);

    @Multipart
    @Headers({
            "User-Agent: Android"
    })
    @POST("events/{groupId}/eventImage")
    Call<ResponseBody> uploadEventImage(@Path("groupId") long groupId,@Part MultipartBody.Part file);


    @Headers({
            "User-Agent: Android"
    })
    @DELETE("events/{eventId}")
    Call<Void> deleteEvent(@Path("eventId") long eventId);


    @Headers({
            "User-Agent: Android"
    })
    @GET("events/{userId}/hostEvents")
    Call<List<AuthEventsResponse>> getHostEvents(@Path("userId") long userId);


    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @PUT("events/{eventId}")
    Call<Void> modifyEvent(@Path("eventId") long eventId, @Body AuthCreateEventRequest eventRequest);


    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("comments/group/{groupId}")
    Call<Void> postComment(@Path("groupId") long groupId ,@Body AuthGroupCommentRequest commentRequest);

    @Headers({
            "User-Agent: Android"
    })
    @GET("comments/group/{groupId}")
    Call<List<AuthGroupCommentResponse>> getComment(@Path("groupId") long groupId);

    @Headers({
            "User-Agent: Android"
    })
    @GET("users/MBTITest")
    Call<Map<String,String>> getMBTISentence();

    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @POST("users/prediction")
    Call<Void> submitMBTIWords(@Body AuthPredictMBTIRequest authPredictMBTIRequest);


    @Headers({
            "Content-Type: application/json",
            "User-Agent: Android"
    })
    @PUT("groups/{groupId}")
    Call<Void> modifyGroup(@Path("groupId") long groupId, @Body AuthCreateGroupRequest groupRequest);


    @Headers({
            "User-Agent: Android"
    })
    @GET("events/{groupId}/events/Image")
    Call<List<String>> getGroupPhoto(@Path("groupId") long groupId);

}

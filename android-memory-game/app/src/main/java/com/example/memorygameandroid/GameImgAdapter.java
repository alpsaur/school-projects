package com.example.memorygameandroid;

import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.SoundPool;
import android.media.AudioAttributes;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Random;

public class GameImgAdapter extends RecyclerView.Adapter<GameImgAdapter.ImageViewHolder> {

    private final List<GameImage> images;
    private final Context context;
    private final boolean[] flipped;
    private boolean gameStarted = false;
    private ImageViewHolder firstFlippedViewHolder = null;
    private int curMatchCount = 0;
    private final int[] laughImgs;
    private boolean isClickable = false;
    private final GameCompletionListener completionListener;
    private final String gameMode;
    private int comboCount = 0;
    private SoundPool soundPool;
    private int flipSound, matchSound, mismatchSound, gameOverSound;
    private int[] comboSounds = new int[5];

    private void playSound(int soundId) {
        soundPool.play(soundId, 1.0f, 1.0f, 1, 0, 1.0f);
    }

    public interface GameCompletionListener {
        void onGameComplete();
    }

    public class ImageViewHolder extends RecyclerView.ViewHolder {
        ImageView whiteFront;
        ImageView imageBack;

        public ImageViewHolder(@NonNull View itemView) {
            super(itemView);

            whiteFront = itemView.findViewById(R.id.white_front);
            imageBack = itemView.findViewById(R.id.image_back);
        }
    }

    public GameImgAdapter(Context context, List<GameImage> images,
                          GameCompletionListener completionListener) {
        this.context = context;
        this.images = images;
        this.flipped = new boolean[images.size()];
        this.completionListener = completionListener;

        final SharedPreferences pref = context.getSharedPreferences("settings", Context.MODE_PRIVATE);
        this.gameMode = pref.getString("game_mode", "normal mode");

        laughImgs = new int[]{R.drawable.laugh1, R.drawable.laugh2, R.drawable.laugh3,
                R.drawable.laugh4, R.drawable.laugh5, R.drawable.laugh6,
                R.drawable.laugh7, R.drawable.laugh8, R.drawable.laugh9,
                R.drawable.laugh10, R.drawable.laugh11, R.drawable.laugh12};

        initSoundPool();
    }

    private void initSoundPool() {
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();

        soundPool = new SoundPool.Builder()
                .setMaxStreams(6) // Allow multiple sounds to play simultaneously
                .setAudioAttributes(audioAttributes)
                .build();

        // Load sounds
        flipSound = soundPool.load(context, R.raw.card_flip, 1);
        matchSound = soundPool.load(context, R.raw.match, 1);
        mismatchSound = soundPool.load(context, R.raw.mismatch, 1);
        gameOverSound = soundPool.load(context, R.raw.gameover, 1);

        // Load combo sounds
        comboSounds[0] = soundPool.load(context, R.raw.combo2, 1);
        comboSounds[1] = soundPool.load(context, R.raw.combo3, 1);
        comboSounds[2] = soundPool.load(context, R.raw.combo4, 1);
        comboSounds[3] = soundPool.load(context, R.raw.combo5, 1);
        comboSounds[4] = soundPool.load(context, R.raw.combo6, 1);
    }

    public void setClickable(boolean clickable) {
        isClickable = clickable;
    }

    @NonNull
    @Override
    public ImageViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Create a new view, which defines the UI of the item
        View view = LayoutInflater.from(context).inflate(R.layout.item_image, parent, false);
        return new ImageViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ImageViewHolder holder, int position) {
        //make itemview display image
        Bitmap bitmap = BitmapFactory.decodeFile(images.get(position).getFile().getAbsolutePath());
        holder.imageBack.setImageBitmap(bitmap);

        if (gameMode.equals("wild mode")) {
            holder.whiteFront.setImageResource(R.drawable.wild_placeholder);
        }

        //set OnclickListener
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!isClickable) return;
                if (!gameStarted) {
                    gameStarted = true;
                }

                int curPosition = holder.getAbsoluteAdapterPosition();
                doFlip(curPosition);
                playSound(flipSound); // Play flip sound

            }

            //flip from white to image
            private void doFlip(int position) {
                if (!flipped[position]) {
                    //set animation to flip card
                    AnimatorSet setOut = (AnimatorSet) AnimatorInflater.loadAnimator(context, R.animator.flip_out);
                    AnimatorSet setIn = (AnimatorSet) AnimatorInflater.loadAnimator(context, R.animator.flip_in);
                    setOut.setTarget(holder.whiteFront);
                    setIn.setTarget(holder.imageBack);
                    setOut.start();
                    setIn.start();

                    //change visibility of image
                    holder.whiteFront.setVisibility(View.GONE);
                    holder.imageBack.setVisibility(View.VISIBLE);
                    flipped[position] = true;

                    //handle match
                    handleMatch(position);
                } //if a img is flipped, do nothing
            }

            //flip from image to white
            private void doFlipBack(ImageViewHolder holder) {
                //set animation to flip card
                AnimatorSet setOut = (AnimatorSet) AnimatorInflater.loadAnimator(context, R.animator.flip_out);
                AnimatorSet setIn = (AnimatorSet) AnimatorInflater.loadAnimator(context, R.animator.flip_in);
                setOut.setTarget(holder.imageBack);
                setIn.setTarget(holder.whiteFront);
                setOut.start();
                setIn.start();
                playSound(R.raw.card_flip); // Play flip back sound

                //set laughing pictures for loser
                if (gameMode.equals("wild mode")) {
                    holder.whiteFront.setImageResource(laughImgs[new Random().nextInt(laughImgs.length)]);
                }

                holder.whiteFront.setVisibility(View.VISIBLE);
                holder.imageBack.setVisibility(View.GONE);
                int Position = holder.getAbsoluteAdapterPosition();
                flipped[Position] = false;
            }

            private void handleMatch(int curPosition) {
                if (firstFlippedViewHolder == null) {
                    //The first of a pair of images is clicked
                    firstFlippedViewHolder = holder;
                } else {
                    RecyclerView recyclerView = (RecyclerView) holder.itemView.getParent();
                    LinearLayout linearLayout = (LinearLayout) recyclerView.getParent();
                    TextView match_counter = linearLayout.findViewById(R.id.match_counter);

                    int lastPosition = firstFlippedViewHolder.getAbsoluteAdapterPosition();
                    int firstFlippedImgId = images.get(lastPosition).getId();
                    int curFlippedImgId = images.get(curPosition).getId();

                    if (lastPosition == curPosition) {
                        //click the same image twice: do nothing
                        return;
                    }

                    if (firstFlippedImgId == curFlippedImgId) {
                        //The second of a pair of images is clicked
                        firstFlippedViewHolder = null;
                        String matchStr = ++curMatchCount + " of 6 matches";
                        match_counter.setText(matchStr);
                        playSound(matchSound);
                        comboCount++;
                        if (comboCount >= 2 && comboCount <= 6) {
                            String comboMessage = comboCount + "x Combo!";
                            if (comboCount == 6) {
                                comboMessage = "Perfect! 6x Combo!";
                            }
                            Toast.makeText(context, comboMessage, Toast.LENGTH_SHORT).show();

                            // Play combo sound
                            playSound(comboSounds[comboCount - 2]);
                        }

                        if (curMatchCount == images.size() / 2) {
                            completionListener.onGameComplete();
                            playSound(gameOverSound);
                        }
                    } else {
                        //match wrongly
                        playSound(mismatchSound);
                        comboCount = 0; // Reset combo count on mismatch

                        Activity activity = (Activity) recyclerView.getContext();
                        Window window = activity.getWindow();
                        // Disable touch events
                        window.setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
                                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);

                        //delay 0.5s then flip back 2 images
                        recyclerView.postDelayed(() -> {
                            doFlipBack(holder);
                            doFlipBack(firstFlippedViewHolder);
                            firstFlippedViewHolder = null;

                            // Enable touch events
                            window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                        }, 500);
                    }
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return images.size();
    }

    @Override
    public void onDetachedFromRecyclerView(@NonNull RecyclerView recyclerView) {
        super.onDetachedFromRecyclerView(recyclerView);
        if (soundPool != null) {
            soundPool.release();
            soundPool = null;
        }
    }
}

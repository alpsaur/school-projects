package com.example.memorygameandroid;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GameImage {
    private final int id;
    private final File file;

    public GameImage(int id, File file) {
        this.id = id;
        this.file = file;
    }

    public int getId() {
        return id;
    }

    public File getFile() {
        return file;
    }

    public static List<GameImage> createFromFilePaths(List<String> filePaths) {
        //store files into List
        ArrayList<GameImage> gameImages = new ArrayList<>();
        for (int i = 0; i < filePaths.size(); i++) {
            GameImage newImage = new GameImage(i, new File(filePaths.get(i)));
            gameImages.add(newImage);
            gameImages.add(newImage);
        }
        //shuffle the order
        Collections.shuffle(gameImages);
        return gameImages;
    }
}


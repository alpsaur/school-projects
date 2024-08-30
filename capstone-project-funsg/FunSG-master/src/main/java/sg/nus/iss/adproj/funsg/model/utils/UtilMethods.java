package sg.nus.iss.adproj.funsg.model.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UtilMethods {

    //helper method: calculate cos similarity of two arrays
    public static double calCosSimilarity(double[] arr1, double[] arr2) {
        if (arr1.length != arr2.length) {
            return 0.0;
        }

        double sum = 0.0;
        double len1 = 1.0;
        double len2 = 1.0;
        for (int i = 0; i < arr1.length; i++) {
            sum += arr1[i] * arr2[i];
            len1 += arr1[i] * arr1[i];
            len2 += arr2[i] * arr2[i];
        }
        len1 = Math.sqrt(len1);
        len2 = Math.sqrt(len2);

        return sum / (len1 * len2);
    }

    //helper method: extract the word between <u></u> in a sentence.
    //example: "I am <u>strong</u>" -> "strong"
    public static List<String> convertSentencesToWords(List<String> sentences) {
        List<String> words = sentences.stream()
                .map(UtilMethods::extractUnderlinedText)
                .flatMap(List::stream)
                .toList();
        return words;
    }

    private static List<String> extractUnderlinedText(String input) {
        List<String> results = new ArrayList<>();

        String regex = "<u>(.*?)</u>";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(input);

        while (matcher.find()) {
            results.add(matcher.group(1));
        }

        return results;
    }
}

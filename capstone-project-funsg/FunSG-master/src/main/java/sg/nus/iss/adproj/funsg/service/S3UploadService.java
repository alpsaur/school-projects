package sg.nus.iss.adproj.funsg.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3UploadService {
    private AmazonS3 s3client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.access_key_id}")
    private String accessKey;

    @Value("${aws.secret_access_key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    // Initialise the S3 client afte the bean is constructed
    @PostConstruct
    private void initializeAmazon() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);

        this.s3client = AmazonS3ClientBuilder
                .standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }

    public String uploadFile(MultipartFile multipartFile, String folderName) throws IOException {
        String fileUrl = "";

        try {
            // Generate a unique file name
            String fileName = folderName + "/" + UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();

            // Metadata for the file
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(multipartFile.getContentType());
            objectMetadata.setContentLength(multipartFile.getSize());

            // Upload file to S3
            s3client.putObject(new PutObjectRequest(bucketName, fileName, multipartFile.getInputStream(), objectMetadata));

            // Generate the file URL
            fileUrl = s3client.getUrl(bucketName, fileName).toString();
        } catch (IOException e) {
            throw new IOException("Error uploading file to S3", e);
        }
        return fileUrl;
    }


}

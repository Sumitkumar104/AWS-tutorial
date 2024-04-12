// AWS is made up of simple a API calls in which , AWS console is a UI(console) for those API calls.
// function like add srvices , create bucket , create instance etc. all are API calls and also we all can do that using AWS SDK.

// AWS SDK is a collection of tools and libraries that allow developers to create and manage AWS resources using code.

// Import necessary modules from AWS SDK
const { S3Client, GetObjectCommand ,PutObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



// Initialize an S3 client with specified region and credentials
const s3Client = new S3Client({
    region: "ap-south-1", // Specify the AWS region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY, // Access key ID from environment variable
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Secret access key from environment variable
    },
});


// Function to generate a signed URL for accessing an object in S3

// Function to generate a signed URL for accessing an object in S3
async function getObjectURL(key) {
    // Create a GetObjectCommand with specified Bucket and key
    const command = new GetObjectCommand({
        Bucket: "bucket-name", // Specify the name of the S3 bucket
        Key: key, // Specify the key of the object in the bucket
    });

    // Generate a signed URL for the GetObjectCommand with specified expiration time
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour (3600 seconds)

    return url; // Return the signed URL
}

// Function to initialize and test getObjectURL function
async function init() {
    // Call getObjectURL function to get signed URL for a test file
    const url = await getObjectURL("test.txt");

    // Output the generated URL
    console.log("URL for test case is:", url);
}

// Call init function to start the execution of the script
init();






// uplaod file to S3 bucket
async function uploadFile(bucketName, key, filePath) {
    // Read the file content
    const fileContent = fs.readFileSync(filePath);

    // Create a PutObjectCommand with specified Bucket, Key, and Body (file content)
    const command = new PutObjectCommand({
        Bucket: bucketName, // Specify the name of the S3 bucket
        Key: key, // Specify the key under which to store the object in the bucket
        Body: fileContent // Set the file content as the body of the object
    });

    try {
        // Execute the PutObjectCommand to upload the file to S3
        const data = await s3Client.send(command);
        console.log('File uploaded successfully:', data);
    } catch (err) {
        console.error('Error uploading file:', err);
    }
}

// Function to initialize and test file upload
async function init1() {
    const bucketName = 'your-bucket-name'; // Specify the name of the S3 bucket
    const key = 'test.txt'; // Specify the key under which to store the object in the bucket
    const filePath = '/path/to/local/file/test.txt'; // Specify the local file path

    // Call uploadFile function to upload the file to S3
    await uploadFile(bucketName, key, filePath);
}

// Call init function to start the execution of the script
init1();
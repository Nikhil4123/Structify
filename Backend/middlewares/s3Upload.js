import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});

export const uploadToS3 = async (file, bucketName, key) => {
	try {
		if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
			throw new Error("AWS credentials missing");
		}

		if (!process.env.AWS_REGION) {
			throw new Error("AWS region not configured");
		}

		if (!bucketName) {
			throw new Error("S3 bucket name not provided");
		}

		console.log('Upload attempt with:', {
			bucket: bucketName,
			key: key,
			hasFile: !!file,
			region: process.env.AWS_REGION
		});

		const uploadParams = {
			Bucket: bucketName,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype
		};

		const upload = new Upload({
			client: s3Client,
			params: uploadParams
		});

		const result = await upload.done();
		
		const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
		return url;
	} catch (error) {
		console.error("Detailed S3 Upload Error:", {
			message: error.message,
			code: error.code,
			requestId: error.$metadata?.requestId,
			attempts: error.$metadata?.attempts
		});
		throw new Error(`S3 Upload Failed: ${error.message}`);
	}
};

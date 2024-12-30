Organization and Team Management Application

Overview

This web application is designed to manage organizations, teams, and team members effectively. The application allows users to register organizations, add teams under these organizations, and include individual members within those teams. Additionally, users can upload images for team members and display dynamic statuses based on image upload status.

Features

1. Organization and Team Management

Register Organizations:

Users can add organizations by providing basic details like name, email, and location.

Add Teams:

Teams can be added under specific organizations.

Add Members:

Individual members can be added to teams with unique IDs.

Hierarchical Display:

Displays a structured list of organizations, their teams, and individual members.

2. File Upload
Image Uploads:
Users can upload profile images for individual members either via camera or file upload.
Images are stored securely in Amazon S3 buckets.
Profile Association:
Uploaded images are linked to individual profiles and managed through S3 storage integration.
Environment Variables
In the .env file, include the necessary credentials for S3 bucket access:

env
Copy code
AWS_ACCESS_KEY_ID=<your-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_BUCKET_NAME=<your-s3-bucket-name>
AWS_REGION=<your-region>

3. Status Display

Dynamic Status Markers:

Red Marker: "Image Not Uploaded."

Green Marker: "Image Uploaded."

Visual Feedback:

Status markers are visible in the individual list view.

4. API Endpoint

Fetch Records:

A REST API endpoint is available to retrieve all individual records in JSON format.

5. Optional Bonus

Deployment:

The application can be deployed to a free hosting platform. A live link will be shared upon deployment.

Tech Stack

Frontend: React with TailwindCSS for styling.

Backend: Node.js with Express.js.

Database: MongoDB for data storage.


Installation

Prerequisites

Node.js and npm/yarn installed.

MongoDB instance running locally or a cloud database (e.g., MongoDB Atlas).


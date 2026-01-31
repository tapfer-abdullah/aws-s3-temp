const express = require('express')
const app = express()
const port = 5000
const fs = require('fs');
require('dotenv').config();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const AWS = require("@aws-sdk/client-s3");
const s3 = new AWS.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

app.get('/', (req, res) => {
  res.send('Hello World! Ci/Cd')
})

app.post('/upload', upload.single('file'), async(req, res) => {

    const file = req.file;
    const key = `${Date.now()}_${file.originalname}`;

    const result = await s3.send(new AWS.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
    }));

    let url = "";

    if(result.$metadata.httpStatusCode === 200){
        url = `${process.env.AWS_BUCKET_URL}${key}`;

        // delete file from local uploads folder
        fs.unlinkSync(file.path);
    }


    console.log(req.file, {result});
    res.json({message: "File uploaded successfully", result: result, url})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

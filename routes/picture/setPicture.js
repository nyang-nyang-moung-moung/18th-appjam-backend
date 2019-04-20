const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const clova = require("./clova.js");
import download from 'image-downloader';
import config from '../../config';
import request from 'request';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'wisemuji',
  api_key: '948844142811467',
  api_secret: 'TBBeTe1fOj0Jh6ZyeKI_VYg_Vp0'
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "appjam18",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 1500, height: 1500, crop: "limit" }]
});
const upload = multer({ storage: storage });
const fields = [
  { name: 'image', maxCount: 1 },
];

module.exports = (app, Users, Images)=>{
  app.post('/setPicture', upload.fields(fields), async (req,res)=>{
    const data = req.body;
    data.images = [];

    if(typeof req.files['image'] != 'undefined'){
        var element = req.files['image'][0];
        const image = { url: element.url, id: element.public_id };
        await Users.updateOne({ token: data.token }, { $push:
           { images: image  }}, async (err) => {
            if(err) console.log(err);

            let file = __dirname + '/public'
            const options = {
              url: file,
              dest: '/tmp.jpg'                  // Save to /path/to/dest/image.jpg
            }
            
            await download.image(options)
            .then(({ filename, image }) => {
              console.log('File saved to', filename)
            })
            .catch((err) => {
              console.error(err)
            })
            
            var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지
            var _formData = {
                image:'image',
                image: await fs.createReadStream(file+'/tmp.jpg') // FILE 경로
            };
            var _req = await request.post({url:api_url, formData:_formData,
                headers: {'X-Naver-Client-Id':config.client_id, 'X-Naver-Client-Secret': config.client_secret}}).on('response', function(response) {
                console.log(response.statusCode) // 200
                console.log(response.headers['content-type'])
            });
            // console.log(_req)

            res.status(200).json(image);
        });
    }
  })

};

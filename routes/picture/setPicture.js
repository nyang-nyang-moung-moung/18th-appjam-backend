const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
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
    let user = new Users(req.body);
    let file = __dirname + '/public'
    let options = {}
    let _req;
    let api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

    if(typeof req.files['image'] != 'undefined'){
        let element = req.files['image'][0];
        const image_id = req.body.id;
        const image = { url: element.url, id: element.public_id };
        // await Users.updateOne({ id: user.id }, { $push:
        //    { images: image  }}, async (err) => {
        //     if(err) res.json(err);
        // });

        options = {
            url: element.url,
            dest: file+'/tmp.jpg'                  // Save to /path/to/dest/image.jpg
        }
        await download.image(options)
        let _formData = {
            image:'image',
            image: await fs.createReadStream(file+'/tmp.jpg') // FILE 경로
        };
        // let _req = await request.post({url:api_url, formData:_formData,
        //     headers: {'X-Naver-Client-Id':config.client_id, 'X-Naver-Client-Secret': config.client_secret}}).on('response', async (response) => {
        //     console.log(response.statusCode) // 200
        //     console.log(response.headers['content-type'])
        // })
        
        async function asyncRequest(options) {
            return new Promise((resolve, reject) => {
            _req = request.post(options, (error, response, body) => resolve({ error, response, body }));
            });
        }
        
        async function posting() {
            let response = await asyncRequest({url:api_url, formData:_formData,
                headers: {'X-Naver-Client-Id':config.client_id, 'X-Naver-Client-Secret': config.client_secret}});
            console.log(response.response.statusCode);
            console.log(_req.response.body);
            let json = {
                data : JSON.parse(_req.response.body)
            }
            console.log(json.data.faces[0].roi)
            let image = new Images();
            image.id = user.id;
            image.url = element.url;
            image.roi = json.data.faces[0].roi;
            console.log('++++'+json.data.faces[0].age.value)
            image.age = json.data.faces[0].age.value;
            try {
                var result = await image.save();
            } catch (e) {
                res.status(200).json({'err':e});
            }
            res.status(200).json(result);
        }
        await posting();

        // await Users.findOne( {images: { id: image_id }}, (err, rawContent) => {
        //     if (err) throw err;
        //     console.log(rawContent);
        //     rawContent.images.roi.unshift(_req.response.body.info.size);
        //     rawContent.save((err) => {
        //         if (err) throw err;
        //     });
        // });
    }

    // 

    // _req.pipe(res);
  })
//   .post('/getPicture', async (req, res)=>{
//         await Images.findOne({ id: image_id }, (err, rawContent) => {
//             if (err) throw err;
//             console.log('id'+image_id);
//             console.log('rawContent'+rawContent);
//             console.log('_req.faces'+_req.faces);
//             rawContent.roi.unshift(_req.faces[0].roi);
//             rawContent.save((err) => {
//                 if (err) throw err;
//             });
//         });
//     }
//   )

};

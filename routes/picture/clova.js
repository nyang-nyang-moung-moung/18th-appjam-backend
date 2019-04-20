import config from '../../config';
import request from 'request';
import fs from 'fs';
import http from "http";

module.exports = async (image_url) => {
  
  //    var api_url = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
  var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지
  console.log(image_url);
  var _formData = {
    image:'image',
    image: await fs.createReadStream(image_url) // FILE 경로
  };
  var _req = await request.post({url:api_url, formData:_formData,
    headers: {'X-Naver-Client-Id':config.client_id, 'X-Naver-Client-Secret': config.client_secret}}).on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type'])
  });
  // console.log( request.head  );
  return _req;
}
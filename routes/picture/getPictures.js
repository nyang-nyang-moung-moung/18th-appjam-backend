
module.exports = (app, Images)=>{
    app.post('/getPictures', async (req,res)=>{
        console.log(req.body)
        let result = await Images.find({id: req.body.id}).sort({date:1}) //최신 순으로 정렬
        res.send(result)
    })
    .post('/getAges', async (req,res)=>{
        
    });
}
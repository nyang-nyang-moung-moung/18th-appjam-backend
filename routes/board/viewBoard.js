module.exports = (app, Users, Boards, Comments) => {
        app.post('/viewBoard', async(req, res) => {
            let result = await Boards.findOne({ token: req.body.token })
            if (!result) return res.status(404).json({ message: "Board Not Found" })
            var data = result;
            let comments = Comments.find({
                'token': { $in: result.comments }
            }, function(err, docs) {
                console.log(docs);
            });
            data.comments = comments;
            console.log(data.comments);
            // data.joined = member_num //참여여부
            return res.status(200).json(data);
        })
    }
    //유저 프로필 사진, 유저 이름, 날짜, 제목, 내용, 댓글
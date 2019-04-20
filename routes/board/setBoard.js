import rndstring from 'randomstring'

module.exports = (app, Users, Groups, Boards) => {
    app.post('/setBoard', async(req, res) => {
            let board = new Boards(req.body);
            console.log(board)
            board.token = rndstring.generate(25);
            Groups.findOne({ token: board.group_token }, (err, rawContent) => {
                if (err) throw err;
                rawContent.boards.unshift(board);
                rawContent.save((err) => {
                    if (err) throw err;
                });
            });
            res.status(200).json(board);
        })
        .post('/aaBoards', async(req, res) => {
            var result = await Boards.find()
            res.status(200).json(result)
        })
        .post('/delBoards', async(req, res) => {
            Boards.remove({}, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.end('success');
                }
            });
        })
}
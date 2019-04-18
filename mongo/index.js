import mongoose from 'mongoose';

mongoose.connect('mongodb://wisemuji:gusanwl0307@ds129085.mlab.com:29085/highthon5', { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() { console.log("Mongo On"); });


let CommentSchema = mongoose.Schema({ //
    token: { type: String }, // 토큰
    comment: { type: String }, // 댓글
    email: { type: String }, // 쓴 사람
    date: { type: Date, default: Date.now } //수정 날짜
});

let BoardSchema = mongoose.Schema({ //게시판
    token: { type: String }, // 토큰
    title: { type: String }, // 제목
    content: { type: String }, // 내용
    date: { type: Date, default: Date.now }, //수정 날짜
    images: [{
        id: { type: String }, //id
        url: { type: String } //url
    }], //그룹 사진
    comments: [CommentSchema] //댓글
});

let GroupSchema = mongoose.Schema({ //그룹
    token: { type: String }, // 토큰
    image: {
        id: { type: String }, //id
        url: { type: String } //url
    }, //그룹 사진
    name: { type: String }, //그룹이름
    introduction: { type: String }, //소개
    cartegory: { type: String }, //카테고리
    date: { type: Date, default: Date.now }, //생성 날짜
    members: [{
        email: { type: String } // 토큰
    }], //멤버 토큰
    boards: [BoardSchema]
});
let UserSchema = mongoose.Schema({ //회원
    token: { type: String }, // 토큰
    image: [{
        id: String, //id
        url: String //url
    }], //프로필 사진
    name: { type: String }, //이름
    email: { type: String }, //이메일(아이디)
    password: { type: String }, //비밀번호
    joined_groups: [GroupSchema], //비밀번호
    interest: { type: String }, // 관심사
});

UserSchema.statics.create = function(name, email, password, interest_main) {
    const user = new this({
        name,
        email,
        password,
        interest_main
    });

    return user.save();
};

UserSchema.statics.findOneByEmail = function(email) {
    return this.findOne({
        email
    }).exec();
}

UserSchema.methods.verify = function(password) {
    return this.password = password
}

require('./err')(UserSchema, GroupSchema, BoardSchema, CommentSchema);

let Users = mongoose.model("users", UserSchema);
let Groups = mongoose.model("groups", GroupSchema);
let Boards = mongoose.model("boards", BoardSchema);
let Comments = mongoose.model("comments", CommentSchema);

export { Users, Groups, Boards, Comments };

export default db;

import mongoose from 'mongoose';
import config from '../config';

mongoose.connect(config.mongo_address, { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() { console.log("Mongo On"); });

let UserSchema = mongoose.Schema({ //회원
    name: { type: String }, //이름
    email: { type: String }, //이메일(아이디)
    password: { type: String }, //비밀번호
    phone: { type: String }, //폰번호
    group: [{
        token: { type: String }, //id
    }], //그룹
    cartegory: [{
        image: { type: String }, //id
    }], //활동 사진
});

let GroupSchema = mongoose.Schema({ //회원
    token: { type: String }, // 토큰
    name: { type: String }, //이름
    members: [{
        token: { type: String }, //id
    }], //멤버
    boards: [{
        token: { type: String }, //id
    }], //멤버
});

let BoardSchema = mongoose.Schema({ //회원
    isNotice: { type: String }, // 공지냐?
    title: { type: String }, // 제목
    content: { type: String }, // 내용
    images: [{
        id: { type: String }, //id
        url: { type: String } //url
    }], // 사진
});

require('./err')(UserSchema, GroupSchema, BoardSchema);

let Users = mongoose.model("users", UserSchema);
let Groups = mongoose.model("groups", GroupSchema);
let Boards = mongoose.model("boards", BoardSchema);

export { Users, Groups, Boards };

export default db;
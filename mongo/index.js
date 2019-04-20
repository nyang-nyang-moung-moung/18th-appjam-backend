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

let ImageSchema = mongoose.Schema({ //회원
    token: { type: String }, // 토큰
    id: { type: String }, //이름
    url: { type: String }, //이메일(아이디)
    age: { type: String } //나이
});

let UserSchema = mongoose.Schema({ //회원
    token: { type: String }, // 토큰
    images: [ ImageSchema ], // 개인 사진
    name: { type: String }, //이름
    id: { type: String }, //이메일(아이디)
    password: { type: String }, //비밀번호
    age: { type: String } //나이
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

require('./err')(UserSchema,ImageSchema);

let Users = mongoose.model("users", UserSchema);
let Images = mongoose.model("images", ImageSchema);

export { Users, Images };

export default db;

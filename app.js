import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

let app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '1gb',
    extended: false
}));

// set the secret key
app.set('jwt-secret', config.secret)

//module setting
import { Users, Images } from './mongo';

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
var swaggerDefinition = {
    info: { // API informations (required)
        title: 'Appjam18', // Title (required)
        version: '1.0.0', // Version (required)
        description: "This is an Api server for 18th Appjam entry ''.  You can find out more at https://github.com/appjam18/appjam18-backend", // Description (optional)
    },
    host: 'localhost:'+config.PORT,
    basepath: '/'
}

// Options for the swagger docs
var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./routes*.js', './parameters.yaml'],
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

//서버 실행
const PORT = config.PORT || 9000;
app.listen(PORT, function() {
    console.log('server running in ' + PORT);
});

require('./routes/auth/auth')(app, Users);
require('./routes/picture/setPicture')(app, Users, Images);
require('./routes/picture/getPictures')(app, Images);
// require('./routes/board/setBoard')(app, Users, Groups, Boards);
// require('./routes/board/viewBoard')(app, Users, Boards, Comments);
// require('./routes/group/getGroup')(app, Users, Groups);
// require('./routes/group/setGroup')(app, Users, Groups);
// require('./routes/index')(app);


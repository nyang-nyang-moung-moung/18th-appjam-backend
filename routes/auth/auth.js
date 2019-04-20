import jwt from 'jsonwebtoken';
import { Users } from '../../mongo/index';
import { Images } from '../../mongo/index';
import { resolve } from 'url';

module.exports = async (app) => {
    /** 
     * POST /signup
     * {
     *     id,
     *     name,
     *     password,
     *     age
     * }
     */
    app.post('/aa', async (req, res) => {
        var result = await Users.find()
        res.send(result)
        // res.status(200).json(_req);
    });
    app.post('/aaImages', async (req, res) => {
        var result = await Images.find()
        res.send(result)
        // res.status(200).json(_req);
    });
    app.post('/dd', async (req, res) => {
        Users.remove({}, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.end('success');
            }
        });
    });
    app.post('/ddImages', async (req, res) => {
        Images.remove({}, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.end('success');
            }
        });
    });
    app.post('/signup', (req, res) => {
        const { id, name, password, age } = req.body;
        let newUser = null;

        let create = (user) => {
            if (user) {
                throw new Error('User is exist');
            } else {
                Users.create( id, name, password, age );
            }
        }

        let respond = () => {
            res.json({
                message: 'Success'
            });
        }

        let onError = (error) => {
            res.status(409).json({
                message: error.message
            });
        }

        Users.findOneById(id)
            .then(create)
            .then(respond)
            .catch(onError)
    });

    /**
     * POST /signin
     * {
     *     id,
     *     password
     * }
     */
    app.post('/signin', (req, res) => {
        const { id, password } = req.body;
        const secret = req.app.get('jwt-secret');

        let check = (user) => {
            if (!user) {
                throw new Error('login failed');
            } else {
                if (user.verify(password)) {
                    let p = new Promise((resolve, reject) => {
                        jwt.sign({
                                _id: user._id,
                                id: user.id
                            },
                            secret, {
                                expiresIn: '1h',
                                subject: 'userInfo'
                            }, (err, token) => {
                                if (err) reject(err)
                                resolve(token)
                            });
                    });

                    return p;
                } else {
                    throw new Error('login failed');
                }
            }
        }

        app.post('/check', (req, res) => {
            const token = req.body.token
                // token does not exist
            if (!token) {
                return res.status(403).json({
                    success: false,
                    message: 'not logged in'
                })
            }

            // create a promise that decodes the token
            const p = new Promise(
                (resolve, reject) => {
                    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                        if (err) reject(err)
                        resolve(decoded)
                    })
                }
            )

            // if token is valid, it will respond with its info
            const respond = (token) => {
                res.json({
                    success: true,
                    info: token
                })
            }

            // if it has failed to verify, it will return an error message
            const onError = (error) => {
                res.status(403).json({
                    success: false,
                    message: error.message
                })
            }

            // process the promise
            p.then(respond).catch(onError)
        });

        let respond = (token) => {
            res.json({
                message: 'success',
                token
            });
        }

        let onError = (error) => {
            console.log(error);
            res.status(403).json({
                message: error.message
            });
        }

        Users.findOneById(id)
            .then(check)
            .then(respond)
            .catch(onError)
    });
}
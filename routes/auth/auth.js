import jwt from 'jsonwebtoken';
import { Users } from '../../mongo/index';
import { resolve } from 'url';

module.exports = (app) => {
    /** 
     * POST /signup
     * {
     *     name,
     *     email,
     *     password,
     *     interest
     * }
     */
    app.post('/signup', (req, res) => {
        const { name, email, password, interest } = req.body;
        let newUser = null;

        let create = (user) => {
            if (user) {
                throw new Error('User is exist');
            } else {
                Users.create(name, email, password, interest);
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

        Users.findOneByEmail(email)
            .then(create)
            .then(respond)
            .catch(onError)
    });

    /**
     * POST /signin
     * {
     *     email,
     *     password
     * }
     */
    app.post('/signin', (req, res) => {
        const { email, password } = req.body;
        const secret = req.app.get('jwt-secret');

        let check = (user) => {
            if (!user) {
                throw new Error('login failed');
            } else {
                if (user.verify(password)) {
                    let p = new Promise((resolve, reject) => {
                        jwt.sign({
                                _id: user._id,
                                email: user.email
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

        Users.findOneByEmail(email)
            .then(check)
            .then(respond)
            .catch(onError)
    });
}
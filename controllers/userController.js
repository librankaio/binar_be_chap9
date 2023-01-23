const { user_game, user_game_room, user_game_history } = require('../models')
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

module.exports = {
    list: async (req, res) => {
        try {
            const data = await user_game.findAll({
                include: [
                    { model: user_game_room },
                    { model: user_game_history }
                ]
            });
            return res.json({
                data: data
            })
        } catch (error) {
            console.log(error)
            return res.json({
                message: "Fatal Error!"
            })
        }
    },
    create: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: "Periksa kembali data data login anda!" });
            }

            const password = bcrypt.hashSync(req.body.password, 10)
            const data = await user_game.create({
                username: req.body.username,
                password: password,
            });

            return res.json({
                message: "Register berhasil, Silahkan Login",
                data: data
            }, 200
            )
        } catch (error) {
            console.log(error)
            return res.json({
                message: "Periksa kembali data data login anda!"
            }, 400
            )
        }
    },
    login: async (req, res) => {
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await user_game.findOne({
                where: {
                    username: req.body.username
                }
            })

            if (!user) {
                return res.json({
                    message: "User not exists!"
                })
            }

            const jwtPayload = jwt.verify(token, 'secret')
            console.log(jwtPayload)
            if (!jwtPayload) { return res.status(403).json({ message: 'unauthenticated' }) }

            res.user = jwtPayload

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload = jwt.verify(token, 'secret')
                if (!jwtPayload) { return res.status(403).json({ message: 'unauthenticated' }) }
                res.user = jwtPayload
                return res.status(200).json({
                    token: token,
                    message: "Anda Berhasil Login dengan token",
                }, 200)
            }

            return res.json({
                message: "Wrong Password!"
            })
        } catch (error) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await user_game.findOne({
                where: {
                    username: req.body.username
                }
            })

            if (!user) {
                return res.json({
                    message: "User not exists!"
                })
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign(
                    { id: user.id },
                    'secret',
                    { expiresIn: '6h' }
                )

                return res.status(200).json({
                    token: token,
                    message: "Anda Berhasil Login tanpa token"
                }, 200)
            }
            return res.json({
                message: "Wrong Password!"
            })
        }
    },
    getProfile: async (req, res) => {
        try {
            const user = await user_game.findOne({
                where: {
                    id: res.user.id
                }
            })

            return res.json({
                data: user
            })

        } catch (error) {
            console.log(error)
            return res.json({
                message: "Fatal Error!"
            })
        }
    },
}
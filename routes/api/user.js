const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const config = require('config');
const { check, validationResult } = require('express-validator');

const db = require("../../app/models/index");
const User = db.user;
const Op = db.Sequelize.Op;

//https://bezkoder.com/node-express-sequelize-postgresql/


router.get('/', async (req, res, next) => {
    const email = req.query.email;
    var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

    try {
        let user = await User.findAll({ where: condition })
        res.json(user)
    } catch (err) {
        console.error("err.message", err.message)
        res.status(500).send({ "error": 'erro em get user!' })
    }
})


// @route    POST /user
// @desc     CREATE user
// @access   Public
router.post('/', [
    check('email', 'email is not valid').isEmail(),
    check('email').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], async (req, res, next) => {
    try {
        let { email, password, name } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {

            return res.status(400).send(errors)
        } else {

            let usuario = { email, password , name}

            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(password, salt);

            await User.create(usuario)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Houve um erro na criação do usuário."
                    });
                });

        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ "error": "Server Error" })
    }
})



module.exports = router;

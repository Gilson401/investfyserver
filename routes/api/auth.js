const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const db = require("../../app/models/index");
const User = db.user;
const Op = db.Sequelize.Op;



// @route    POST /auth
// @desc     Authenticate user & get token 
// @access   Public
router.post('/', [
    check('email', "REQUIRED_PASSWORD").exists(),
    check('password', "REQUIRED_PASSWORD").exists()
], async (req, res) => {
    console.log("req em post auth", req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Erro em auth post ")
        return res.status(400).json({ errors: errors.array() })
    }
    
    const jwtSecret = process.env.JWT_SECRET

    const { password, email  } = req.body
    var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

    try {
        let user = await User.findAll({ where: condition }) 

        if (!user) {

            return res.status(404).json({ errors: [{ msg: "User não localizado" }] })
        } else {

            const isMatch = await bcrypt.compare(password, user[0].dataValues.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "PASSWORD_INVALID" }] });
            } else {
                // console.log("Encontrou user", user)
                const payload = {
                    usuario: {
                        id: user[0].dataValues.id,
                        email: user[0].dataValues.email
                    }
                }
                jwt.sign(payload, jwtSecret, { expiresIn: '25 days' },
                    (err, token) => {
                        if (err) throw err;
                        payload.token = token
                        res.json(payload);
                    }
                );
            }
        }

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ 'login err': err.message })
    }

})

module.exports = router;

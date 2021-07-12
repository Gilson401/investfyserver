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


// @route    POST /auth
// @desc     Authenticate user & get token 
// @access   Public
router.post('/', [
    
    check('password', "REQUIRED_PASSWORD").exists()
], async (req, res) => {
    console.log("req em post auth", req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Erro em auth post ")
        return res.status(400).json({ errors: errors.array() })
    }
    
    const jwtSecret = process.env.JWT_SECRET

    const { password, credent  } = req.body
    
    try {
        let user = await User.findOne( { $or:[ {'email':credent}, {'cpf': credent}, {'matricula': credent} ]})
            .select('id password email nome tipo organizacao disciplina turmasprof matricula')
            .populate('organizacao disciplina turmasprof')

        if (!user) {

            return res.status(404).json({ errors: [{ msg: "User não localizado" }] })
        } else {

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "PASSWORD_INVALID" }] });
            } else {
                // console.log("Encontrou user", user)
                const payload = {
                    user: {
                        id: user.id,
                        name: user.nome,
                        role: user.tipo,
                        organizacao: user.organizacao._id,
                        orgname: user.organizacao.name,
                        disciplina: user.disciplina,
                        turmasprof: user.turmasprof,
                        matricula: user.matricula
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

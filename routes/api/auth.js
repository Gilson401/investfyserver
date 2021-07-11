const express = require('express');
const router = express.Router();
const User = require('../../models/models_user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const config = require('config');
const { check, validationResult } = require('express-validator');
const MSGS = require('../../messages')


// @route    POST /auth
// @desc     Authenticate user & get token 
// @access   Public
router.post('/', [
    
    check('password', MSGS.REQUIRED_PASSWORD).exists()
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

            return res.status(404).json({ errors: [{ msg: MSGS.USER404 }] })
        } else {

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: MSGS.PASSWORD_INVALID }] });
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

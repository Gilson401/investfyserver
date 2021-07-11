const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route    GET /turma
// @desc     LIST turma
// @access   private
router.get('/',  [], async (req, res, next) => {
  try {

    const piada = await axios.get('https://geek-jokes.sameerkumar.website/api?format=json');

    res.status(200).json(piada.data.joke)
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": err.message })
  }
})





  

  module.exports = router;

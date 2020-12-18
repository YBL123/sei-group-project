const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret  = process.env.JWT_SECRET

const register = async (req, res) => {
  try {
    console.log('is this working')
    const user = await User.create(req.body)
    console.error('register', user)
    res.status(201).json({ message: `${user.email} has been registered` })
  } catch (err) {
    res.status(422).json(err)
  }
}
const login = async (req, res) => {
  try {
    console.log('user wanted: ', req.body)
    const user = await User.findOne({ email: req.body.email })
    console.log('user found: ', user)
    // if (!user || !user.validatePassword(req.body.password)) {
    //   throw new Error()
    // }
    console.log('this code is running')
    const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '7 days' })

    console.log('this is the token', token)
    
    res.status(202).json({ 
      message: `Welcome back ${user.name}`,
      token
    })

  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = {
  register, login
}
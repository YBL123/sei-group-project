const Plant = require('../models/plant')
const User = require('../models/user')

async function newOffers(req, res, ) {
  try {
    const plantId = req.params.id
    const offeredPlantId = req.params.plantid
    const offeredPlant = await Plant.findById(offeredPlantId)
    const plant = await Plant.findById(plantId)
    const user = await User.findById(req.currentUser._id)
    req.body.user = user

    if (!plant) throw new Error()

    req.body.imageUrl = offeredPlant.imageUrl
    req.body.name = offeredPlant.name
    req.body.plantId = offeredPlant._id

    plant.offers.push(req.body)

    // user.submittedOffers.push(plant.offers[plant.offers.length - 1 ].user.name) 
    await plant.save()
    await user.save()

    res.status(201).json(plant.offers)
  } catch (err) {
    res.status(422).json({ message: 'youre wrong' })
  }
}

async function respondOffer(req, res) {
  try {
    req.body.user = req.currentUser
    const userId = req.params.id
    const plantId = req.params.plantid
    const decision = req.params.decision
    const offeredPlantId = req.params.offered
    const offeredPlant = await Plant.findById(offeredPlantId)
    const plant = await Plant.findById(plantId)
    const user = await User.findById(userId)
    const currentUser = await User.findById(req.currentUser._id)

    req.body.userName = currentUser.name
    req.body.userId = currentUser._id
    req.body.email = currentUser.email
    req.body.plantId = plant._id
    req.body.plantName = plant.name
    req.body.plantImageUrl = plant.imageUrl
    req.body.response = decision
    req.body.offeredImageUrl = offeredPlant.imageUrl
    req.body.offeredPlantId = offeredPlant._id
    req.body.offeredPlantName = offeredPlant.name
    req.body.respondedUserId = user._id

    user.submittedOffers.unshift(req.body)
    await user.save()
    res.status(201).json({ message: 'hi' })


  } catch (err) {
    console.log(err)
  }
}

async function finishTrade(req, res) {
  req.body.user = req.currentUser
  try {
    const userId = req.params.userid
    const user = await User.findById(userId)

    const offerId = req.params.offerid
    const offerToRemove = user.submittedOffers.id(offerId)

    const plantId = req.params.plantid
    const userPlantId = req.params.userplantid
    const plant = await Plant.findById(plantId)
    const userPlant = await Plant.findById(userPlantId)

    await offerToRemove.remove()
    await user.save()

    await plant.remove()
    await userPlant.remove()




    res.sendStatus(204)

  } catch (err) {
    res.status(422).json(err)
  }
}

module.exports = {
  newOffers,
  respondOffer,
  finishTrade
}
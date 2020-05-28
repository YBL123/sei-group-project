
import React from 'react'
import { Link } from 'react-router-dom' //* Importing link component from 'react-router-dom' so we can make an edit button to Link to the EditPLant page.
import { getSinglePlant, deletePlant, makeOffer, getPortfolio } from '../../lib/api'
import { isOwner } from '../../lib/auth'
import PlantMapThumbnail from '../common/PlantMapThumbnail'
import Likes from '../common/Likes'
import PlantInfoBox from '../common/PlantInfoBox'
import { HeightInfoBox } from '../common/HeightInfoBox'
import Comments from '../common/Comments'
import Select from 'react-select'


class ShowPlant extends React.Component {
  state = {
    plant: null,
    user: null,
    offerData: {
      offer: '',
      // text: ''
    },
    isOffer: false,
    userPlantId: '',
    selectOptions: []
  }

  async componentDidMount() {
    try {
      const plantId = this.props.match.params.id
      const res = await getSinglePlant(plantId)
      const resTwo = await getPortfolio()
      this.setState({ plant: res.data, user: resTwo.data }, this.fillOffersBox)

    } catch (err) {
      this.props.history.push('/notfound')
    }
  }

  fillOffersBox = () => {
    // console.log('fill offers ran')
    const options = []
    this.state.user.createdPlants.forEach(userPlant => {

      options.push({ value: userPlant._id, label: userPlant.name })

    })
    this.setState({ selectOptions: options })
    // console.log(this.state.selectOptions)
  }

  // {this.state.user.createdPlants.map(userPlant => {
  //   return <>
  //           <option key={userPlant._id} value={userPlant._id}>{userPlant.name}</option>

  //           </>
  // }
  // )}

  handleDelete = async () => { // * our function to handle the click of the delete button
    try {
      const plantId = this.props.match.params.id // * this plant id to be deleted, from the url
      await deletePlant(plantId) // * use the deletePlant function, passing the plant id as the argument.
      this.props.history.push('/plants') // * when succesfully deleted, redirect our user to the index page
    } catch (err) {
      this.props.history.push('/notfound') // * if something goes wrong, push the user to the error page
    }
  }

  clicker = () => {
    this.setState({ isOffer: this.state.isOffer === false ? true : false })
  }

  handleChange = event => {
    const offerData = { ...this.state.offerData, [event.target.name]: event.target.value }
    this.setState({ offerData })
    if (event.target.name === 'offer') {
      this.handleOffer(event.target.value)
      console.log('val', event.target.value);
    }
  }

  handleSelectChange = event => {
    // console.log('value: ', event.value)
    const offerData = { ...this.state.offerData, offer: event.value }
    this.setState({ offerData })
    this.handleOffer(event.value)
    // console.log(this.state.offerData)
  }

  handleOffer = value => {
    this.setState({ userPlantId: value })

  }

  handleSubmit = async (event) => {
    event.preventDefault()
    // console.log('at submit: ', this.state)
    try {
      const plantId = this.props.match.params.id
      const res = await makeOffer(plantId, this.state.userPlantId, this.state.offerData)
      this.setState({ offerData: res.data })
      this.clicker()
    } catch (err) {
      console.log(err)
    }
  }


  render() {
    if (!this.state.plant) return null // * if there is no plant object, return null
    const { plant, isOffer } = this.state // * deconstruct the plant from state

    // console.log(this.state.user)
    // console.log(plant.imageUrl)

    return (
      <section className="section m-scene">
        <div className="container">
          <h2 className="title has-text-centered">{plant.name}</h2>
          {plant.nickName && <h2 className="title is-5 has-text-centered">{`'${plant.nickName}'`}</h2>}
          <hr />
          <div className="columns scene_element scene_element--fadein">
            <div className="column is-half">
              <figure className="image">
                <img className="show-image" src={plant.imageUrl} alt={plant.name} />
              </figure>
              <Likes
                likes={plant.likes}
                plantId={plant._id}
              />
              <br />
              <Comments
                plantId={plant._id}
              />
            </div>
            <div className="column is-half">
              <h4 className="title is-4">Description</h4>
              <p>{plant.description}</p><br></br>
              <PlantInfoBox plantInfo={plant} /><br></br>
              <HeightInfoBox plantInfo={plant} />
              <hr />
              {/* <h4 className="title is-4">Height</h4>
              <hr />
              <p>{plant.height}</p>
              <hr /> */}

              {/* <h4 className="title is-4">Location</h4>
              <hr />
              <p>{plant.lat}</p>
              <p>{plant.lon}</p> */}
              <PlantMapThumbnail
                _id={plant._id}
                lat={plant.location[0].lat}
                lon={plant.location[0].lon}
                name={plant.name}
                nickName={plant.nickName}
                imageUrl={plant.imageUrl}
              />
              <div className="added-by">
                <h4 className="title is-6">Added By</h4>
              </div>
              {!isOwner(plant.user._id) &&
                <Link to={`/profile/${plant.user._id}`}>
                  <p>{plant.user.name}</p>
                </Link>
              }

              {isOwner(plant.user._id) &&
                <>
                  <p>You</p>
                  <hr />
                  <Link to={'/profile'}>
                    Go To My Portfolio
                  </Link>
                </>
              }
              <hr />
              {!isOwner(plant.user._id) &&
                <>
                  <button
                    className="button make-offer-button"
                    onClick={this.clicker}>Make Offer
              </button>
                  <hr />
                </>
              }

              {isOffer &&
                <>
                  <form onSubmit={this.handleSubmit} className="column is-half is-offset-one-quarter box">

                    <div className="field">
                      <label className="label">Your Offer: </label>
                      <div className="control">
                        <Select
                          name="offer"
                          placeholder="Choose a plant to trade"
                          onChange={this.handleSelectChange}
                          options={this.state.selectOptions}
                        />
                        {/* <input type="text" list="data" name="offer" onChange={this.handleChange} />
                        
                        <datalist id="data">
                          {this.state.user.createdPlants.map(userPlant => {
                            return <>
                                    <option key={userPlant._id} value={userPlant._id}>{userPlant.name}</option>
      
                                    </>
                          }
                          )}
                        </datalist> */}
                      </div>

                    </div>
                    <div className="field">
                      <label className="label">Message for User: </label>
                      <div className="control">
                        <textarea
                          className="input"
                          placeholder="Message"
                          name="text"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <button type="submit" className="button submit-offer-button">Submit Offer</button>
                    </div>
                  </form>
                  <hr />
                </>
              }


              {isOwner(plant.user._id) &&
                <div className="buttons">
                  <Link to={`/plants/${plant._id}/edit`} className="button show-edit-button">Edit</Link>
                  {/* <hr /> */}

                  <button onClick={this.handleDelete} className="button show-delete-button">Delete</button>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    )
  }

}

export default ShowPlant
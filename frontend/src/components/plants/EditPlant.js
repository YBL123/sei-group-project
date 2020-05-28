import React from 'react'
import { getSinglePlant, editPlant } from '../../lib/api'
import { handlePlantFormErrors } from '../../lib/formErrors'

//* Importing our "getSinglePlant" and "editPlant" functions, we need "getSinglePlant" so we can get the data needed to pre-populate teh edit form. We then use "editPlant" to send that new edited data to the server

import FormPlant from './FormPlant' //* Importing the FormPlant component

class EditPlant extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: { //* our formData in state, matches the object we need to send in the request
        name: '',
        imageUrl: '',
        trefleId: '',
        description: '',
        height: '',
        nickName: '',
        location: []
      },
      options: [],
      errors: {}, // * an object to store any errors that could occur when making the request.
      place: null
    }
    this.handleSelect = this.handleSelect.bind(this)
  }
  handleSelect(lat, lon) {
    const formData = { 
      ...this.state.formData, location: [{lat: lat, lon: lon}]
    }
    this.setState({ formData })
    // console.log('parent', this.state.formData.location)
  }


  async componentDidMount() { 
    const plantId = this.props.match.params.id //* ge the id of the plant to edit from the url, accessing the value through react routers props object
    try {
      const res = await getSinglePlant(plantId) //* make a request to get the current data of the plant our user wants to edit
      this.setState({ formData: res.data }) //* set that as our formData, to pre-populate the form with
    } catch (err) {
    //   this.props.history.push('/notfound') //* if any error occurs, redirect our user to the error page via the history prop object from react-router
    }
  }

  handleChange = event => {//* Standard handleChange function for our form inputs, it will update our "formaData" object in state. To work, all inputs using it must have a "name" attribute that matches one from our formData object.
    console.log('handle change ran', event.target.name)
    const formData = { ...this.state.formData, [event.target.name]: event.target.value } //* we create a new copy of the form data object in state, updating whichever field the user just typed into by name and value
    const errors = { ...this.state.errors, [event.target.name]: '' } // * any error that may have been present for that field will be reset
    this.setState({ formData, errors }) // * Set those new values into state, to see the update in the DOM
  }

  handleSelectChange = event => {
    const sciName = { ...this.state.formData, scientificName: event.value } //* we create a new copy of the form data object in state, updating whichever field the user just typed into by name and value
    const errors = { ...this.state.errors, [event.name]: '' } // * any error that may have been present for that field will be reset
    this.setState({ formData: sciName, errors }) // * Set those new values into state, to see the update in the DOM
    // console.log(this.state.formData.scientificName)
  }

  handleSubmit = async event => { // * a function to handle the submission of our form
    event.preventDefault() // * preventing the submission resetting the page

    const plantId = this.props.match.params.id // * getting our plant id to edit from the URL
    try {
      // console.log('formdata', this.state.formData)
      await editPlant(plantId, this.state.formData) // * using our editPlant function, passing it the plant id to edit, and the new data for it. 
      this.props.history.push(`/plants/${plantId}`) // * once we awaited the edit function, we redirect the user to the ShowPlant page, so they can see the edits they've made.
    } catch (err) {
      this.setState(handlePlantFormErrors(err.response.data.errors)) // * any errors that occured, we set into our error object in 
    }
  }

  setImgUrl = (childData) => {
    const formData = { ...this.state.formData, imageUrl: childData }
    this.setState({ formData })
  }
  setImgUrl = (childData) => {
    const formData = { ...this.state.formData, trefleId: childData }
    this.setState({ formData })
  }

  render() {
    // console.log("render", this.state.formData)
    return (
      <section className="section">
        <div className="container">
          <FormPlant
            formData={this.state.formData}
            errors={this.state.errors}
            handleChange={this.handleChange}
            handleSelectChange={this.handleSelectChange}
            handleSubmit={this.handleSubmit}
            onSelect={this.handleSelect}
            imageUrl={this.setImgUrl}
            trefleId={this.setTrefleId}
            buttonText="Edit my Plant"
          />
        </div>
      </section>
    )
  }
}

export default EditPlant
import React from 'react'
import axios from 'axios'

let getDataRuns = 0

class PlantInfoBox extends React.Component {
  state = {
    scientificName: this.props.plantInfo.scientificName,
    commonName: this.props.plantInfo.name,
    plantData: '',

  }

  componentDidMount() {
    this.getPlantData(this.state.scientificName)
  }

  getPlantData = async (query) => {
    try{
          const response = await axios.post('/api/summary', {query})

    for (var key in response.data.query.pages) {
      var lastObj = response.data.query.pages[key];
    }

    const extract =lastObj.extract

    if(extract) {
      // console.log('ran once', extract)
      this.setState({ plantData: extract })
    } else if(!extract && getDataRuns < 1){
      // console.log('ran twice', extract)
      this.getPlantData(this.state.commonName)
      getDataRuns++
      if(!extract){
        this.setState({ plantData: 'Sorry we cannot find any information about this plant' })
        getDataRuns++
        return
      }
    }
    
    } catch {
      this.setState({ plantData: 'Something went wrong getting this info.' })
    }

  }


  render(){
    // console.log('box props', this.state.scientificName)
    
    return(
      <h1>{this.state.plantData}</h1>
    )
  }
}

export default PlantInfoBox
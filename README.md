<img align="left" width="50" height="50" src="GA.png" alt="GA logo">

# Project 3: plntify
![plntfy logo](readme-plntify.svg)

## Overview

A plant trading social app. 
The time frame for this group project was a week. Our group was made up of 4 members.

Each user has their own portfolio of plants that is diplayed on their profile page.

The users are able to use the interactive map to see other plant's locations. Users are also able to add their own plant's location when they add a plant or edit their plant. 
A map thumbnail with a marker for the plant's location is also displayed on each plant page.

There is a trade feature where users are able to offer a plant from their portfolio in exchange for another user's plant. The user who receives this offer is able to accept or decline. The user who made the offer is able to see their offer's status via their profile page.

Users are able to like and comment on other user's plants, as well as being able to communicate through a private chat.

## Team

* [Aino Kytölä](https://github.com/ainokyto)
* [George Jones](https://github.com/Jompra) 
* [Jakub Horun](https://github.com/ykbhrn)

## Deployment

The website is deployed on Heroku and can be found [here](http://plntify-app.herokuapp.com/)

(After one hour of inactivity Heroku puts the dyno to sleep. The first request may be be wakening it up again and so the first request the router sends will have some delay).

## Built With

* React
* Express
* Node.js
* MongoDB
* Sass
* Axios 
* Bulma
* Git
* GitHub
* Mapbox API
* Trefle API
* Cloudinary
* Pexels API
* Moderation API

## Getting Started

To download the source code click the clone button. Run the following commands in the terminal:

* To install all packages listed in the package.json:
```terminal
npm i
```

* To run the app in your localhost:
* In both front and back:
```terminal
npm run start
```

## Brief

* **Build a full-stack application** by making your own backend and your own front-end
* **Use an Express API** to serve your data from a Mongo database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models
* **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut
* **Have a visually impressive design** to kick your portfolio up a notch and have something to wow future clients & employers. **ALLOW** time for this.
* **Be deployed online** so it's publicly accessible.

## Website Architecture

### Wireframe

* Link to our [wireframe](https://balsamiq.cloud/siy86e/pgk0p3q/r7402)
![plntfy wireframe](readme-plntify-wireframe.png)

The main components are the home page, index page, profile page, plant page. Users are also able to interact with the map through the home/index page and through the map thumbnail on each plant page. Trade and chat are accessed through the user's profile page. The user can also check their chat inbox through the navbar.

I will give an overview of the app's architecture and delve into more detail on some of the features I built.

## Home 

### Register & Login

When first loading the page, if the user has not registered and logged in, they are met with this page. 
We chose to do this as users can only really interact with the app once they have created an account and a portfolio. The navbar items are completely hidden until the user registers and logs in.

![plntfy home](readme-home.png)

### Index

Once the user has registerd and logged in, the index page also doubles as the home page. The user gains acess to all of the app's features. All items in the navbar become visible.

![plntfy index](readme-index.png)

### Profile Page

The user is greeted with a welcome message that changes according to the time of day. Here the user is able to view their portfolio, offers and responses.

![plntfy profile](readme-profile.png)

### Create Plant

![plntfy create](readme-create.png)

When the user adds a new plant to their portfolio they are able to add it's 'Nickname', 'Common-Name' (which prompts the 'Scientific Name'), 'Height in Centimeters', 'Description',  'Upload Image'.  Finally they are able to use the auto-complete location search input to enter the plant's address to fill in the 'Location'.

This was done using the MapBox GL API.

```javascript
 class FormPlant extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      search: '',
      results: [],
      isLoading: false,
      lon: '',
      lat: '',
      test: '',
      errors: {},
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleItemClicked = this.handleItemClicked.bind(this)
  }

  handleSearchChange(e) {
    this.setState({
      search: e.target.value,
      isLoading: true
    })

    // Stop the previous setTimeout if there is one in progress
    clearTimeout(this.timeoutId)

    // Launch a new request in 1000ms
    this.timeoutId = setTimeout(() => {
      this.performSearch()
    }, 1000)
  }
  performSearch() {
    if (this.state.search === "") {
      this.setState({
        results: [],
        isLoading: false
      })
      return
    }
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.search}.json?access_token=${mapBoxKey}`)
      .then(response => {
        this.setState({
          results: response.data.features,

          isLoading: false
        })
      })
  }
  handleItemClicked = async (place) => {

    const search = await place.place_name
    const lon = await place.geometry.coordinates[0]
    const lat = await place.geometry.coordinates[1]
    this.setState({
      lat: lat,
      lon: lon,
      search: search,
      results: []
    })
    // console.log(this.state)
    this.props.onSelect(lat, lon)

  }
```

The address is condensed into lattitude and longitude. This was done to translate to the map and place the marker on the map thumbnail.

![plntfy location autocomplete](readme-location.png)

```javascript
       <div className="field">
            <label className="label">Location</label>
            <div className={`control ${errors.description ? 'is-danger' : ''}`}>
              <div className="AutocompletePlace">
                <input
                  className="input AutocompletePlace-input" type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="Type an address"
                />
                <ul className="AutocompletePlace-results">
                  {this.state.results.map(place => (
                    <li
                      key={place.id}
                      className="AutocompletePlace-items"
                      onClick={() => this.handleItemClicked(place)}
                    >
                      {place.place_name}
                    </li>
                  ))}
                  {this.state.isLoading && <li className="AutocompletePlace-items">Loading...</li>}
                </ul>
```

### Plant Page

![plntfy plant page](readme-show.png)

### Map Thumbnail

I built the map thumbnail as a separate component. That way it could be easily be imported and used anywhere on the app so long as it has an object passed down as props. This component passes the props to the lat and lon. The value for the lat and lon is assigned when a plant is added or edited.

```javascript
import React from 'react'
import { Link } from 'react-router-dom'
import MapGl, { Marker } from 'react-map-gl' // The map component
import 'mapbox-gl/dist/mapbox-gl.css' // any CSS styling needed to make the map work
const token = process.env.REACT_APP_MAPBOX_TOKEN

const PlantMapThumbnail = (props) => {
  return (
    <>
      <div>
        <Link to={{
          pathname: '/maps',
          state: {
            latitude: parseFloat(props.lat),
            longitude: parseFloat(props.lon),
            plantProps: {
              id: props._id,
              name: props.name,
              nickName: props.nickName,
              imageUrl: props.imageUrl
            }
          }
        }} >
          <MapGl
            mapboxApiAccessToken={token}
            height={'30vh'}
            width={'30vw'}
            mapStyle='mapbox://styles/mapbox/light-v10'
            latitude={parseFloat(props.lat)}
            longitude={parseFloat(props.lon)}
            zoom={10}
          >
            <div key={props._id}>
              <Marker
                latitude={parseFloat(props.lat)}
                longitude={parseFloat(props.lon)}
              >
                <img src={require("../../lib/plntify_stamp.png")} alt="Plntify Logo" height="25vh" width="25vw" />
              </Marker>
            </div>
          </MapGl>
        </Link>
      </div>
    </>
  )
}

export default PlantMapThumbnail
```

The PlantMapThumbnail is called on in the ShowPlant component. 

```javascript
     <PlantMapThumbnail
                _id={plant._id}
                lat={plant.location[0].lat}
                lon={plant.location[0].lon}
                name={plant.name}
                nickName={plant.nickName}
                imageUrl={plant.imageUrl}
              />
```

### Likes 

Users are able to like and unlike plants from the index page and on the plant page.

* stays even when reloading page

* back 

* insert code snippet

* front 

* insert code snippet

![plntfy likes](readme-likes.png)

### Comments

*  able to do so on plant page

* back 

* insert code snippet

* front 

* insert code snippet

* add comment

* insert code snippet

* delete comment

* insert code snippet

* show more, show less

* insert code snippet

![plntfy comments](readme-comments.png)


## Wins

* how well we worked together as a team etc....
* Communication was key
* Also used trello but mainly just discussed during standup every morning and updating each other whenever we were finished with a task or stuck, on zoom and on slack all day.

## Challenges

* full-stack comments and likes....

<!-- ## Bugs
? -->

## Future Improvements

* Fine-tune trade and chat
* Fine-tune styling
* Exapand on social aspect. Followers, favourites
* Add likes to comments
* Index page dropdown to also filter plants by newest, favourites, following, location - through search input.
* An about page that is visible before registering/logging in and after.

## Credits
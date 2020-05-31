<img align="left" width="50" height="50" src="GA.png" alt="GA logo">

# Project 3: plntify
![plntfy logo](readme-plntify.svg)

## Overview

A plant trading social app. 
The time frame for this group project was a week. Our group was made up of 4 members.
Each user has their own portfolio of plants that is diplayed on their profile page. The users are able to use the interactive map to see other plant's locations. Users are also able to add their own plant's location when they add a plant or edit their plant. There is a trade feature where users are able to offer a plant from their portfolio in exchange for another user's plant. The user who receives this offer is able to accept or decline. The user who made the offer is able to see their offer's status via their profile page. Users are able to like and comment on other user's plants, as well as being able to communicate through a private chat.

## Team

* [Aino Kytölä](https://github.com/ainokyto)
* [George Jones](https://github.com/Jompra) 
* [Jakub Horun](https://github.com/ykbhrn)

## Deployment

The website is deployed on Heroku and can be found [here](http://plntify-app.herokuapp.com/)

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
* Mapbox GL
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

The main components are the home page, index page, profile page, plant page. Users are also able to interact with the map through the home/index page and through the map thumbnail on each plant page. Trade and chat are accessed through the user's profile page.

I will give an overview of the app's architecture and delve into more detail on some of the features I built.

## Home 

### Register & Login

When first loading the page, if the user has not registered and logged in, they are met with this page. 
We chose to do this as users can only really interact with the app once they have created an account and a portfolio. The navbar items are completely hidden until the user registers and logs in.

![plntfy home](readme-home.png)

### Index

Once the user has registerd and logged in, the index page also doubles as the home page. The user gains acess to all of the app's features. All items in the navbar become visible.

![plntfy index](readme-index.png)


### Create Plant

![plntfy create](readme-create.png)

### Plant Page

![plntfy page](readme-show.png)

### Profile Page

![plntfy profile](readme-profile.png)


When the user adds a new plant to their portfolio they are able to add it's scientific name, upload an image and use the auto-complete location search in put to enter the plant's location.

## Wins

* how well we worked together as a team etc....
* Communication was key
* Also used trello but mainly just discussed during standup every morning and updating each other whenever we were finished with a task or stuck, on zoom and on slack all day.

## Challenges

* full-stack comments and likes....

## Bugs
?

## Future Improvements

* Fine-tune trade and chat
* Fine-tune styling
* Exapand on social aspect. Followers, favourites
* Add likes to comments
* Index page dropdown to also filter plants by newest, favourites, following, location - through search input.
* An about page that is visible before registering/logging in and after.

## Credits
import React from 'react'
import { addLikes } from '../../lib/api'
import { getUserId } from '../../lib/auth'

class Like extends React.Component {
  state = {
    likes: [],
    likesCounter: 0, 
    liked: false,
    style: 'far fa-heart fa-lg'
  }

  async componentDidMount() {
    try {
      this.setState({ likes: this.props.likes })
      this.setState({ likesCounter: this.props.likes.length })

      const userId = await getUserId()
      const likes = this.state.likes

      likes.forEach(like => {
        if(like.userId.toString() === userId.sub.toString()) {
          this.setState({ liked: true })
          this.setState({ style: 'fas fa-heart fa-lg' })
          // console.log('like is true')
        }
      })
    } catch(err) {
      console.log(err)
    }
  }
  
  likeHandler = async () => {
    const newLikedPlant = await addLikes(this.props.plantId)
    // console.log(newLikedPlant)
    this.setState({ likesCounter: newLikedPlant.data.likeCount })
    
    if(newLikedPlant.data.likeStatus) {
      this.setState({ style: 'fas fa-heart fa-lg' })
    } else {
      this.setState({ style: 'far fa-heart fa-lg' })
    }

  }

  render() {
      return (
        <div>
          <button
            className="like-button"
            onClick={this.likeHandler}
          >
            <i className={this.state.style}></i>
            {this.state.likesCounter}
          </button>
        </div>
      )
    }

}



export default Like
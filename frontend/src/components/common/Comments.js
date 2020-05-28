import React from 'react'

import { addComment, getSinglePlant, deleteComment } from '../../lib/api'
import { isOwner } from '../../lib/auth'

class Comments extends React.Component {
  state = {
    plant: null,
    text: '',
    rows: '3',
    commentsStatus: true,
    buttonText: 'Show more comments'
  }

  async getData() { //* this function can be called whenever you need to update the info on the page
    try {
      const plantId = this.props.plantId
      const res = await getSinglePlant(plantId)
      this.setState({ plant: res.data })
      // console.log(this.state.plant.comments)
    } catch (error) {
      console.log(error)
      // this.props.history.push('/notfound')
    }
  }
  componentDidMount() {
    // console.log(this.props.plantId)
    this.getData() //* calling the getData function as soon as the page loads to display the info straight away
  }


  //* COMMENTS
  commentHandleChange = event => {
    const text = event.target.value //* saving what the user types into the comment box
    this.setState({ text }) //* setting state with their comment
  }

  commentHandleSubmit = async event => {
    event.preventDefault()
    const plantId = this.props.plantId
    try {
      await addComment({ text: this.state.text }, plantId) //* the add comment function requires a text field so you can pass it through like so - also it needs to match the order that you're using the arguments in your api.js file
      this.setState({ text: '' }) //* setting the comment box back to empty
    } catch (err) {
      console.log(err.response.data)
    }
    this.getData() //* calling this getData function again to reload the page with the new database info and display your new comment straight away!
  }

  commentHandleDelete = async event => {
    event.preventDefault()

    try {
      const commentId = event.target.getAttribute('comment-id')
      const plantId = this.state.plant._id
      await deleteComment(plantId, commentId)
    } catch (err) {
      console.log(err)
    }
    this.getData()
  }

  showMoreCommentsHandleClick = async () => {
    // console.log('showing more')
    // event.preventDefault()
    //* now the rows will be equal to the comments array lenght and all the comments will be shown
    const newRows = this.state.plant.comments.length
    this.setState({ rows: newRows })
    this.getData()

  }

  ShowLessCommentsHandleClick = async () => {
    // console.log('showing less')
    // event.preventDefault()

    const lessRows = '3'
    this.setState({ rows: lessRows })
    this.getData()
  }

  toggleCommentsHandleClick = async event => {
    event.preventDefault()
    const show = this.state.commentsStatus
    // console.log(show) 
    
    if (show) {
      this.setState({ commentsStatus: false , buttonText: 'Show less comments' })
      this.showMoreCommentsHandleClick()
    } else {
      this.setState({ commentsStatus: true , buttonText: 'Show more comments' })
      this.ShowLessCommentsHandleClick()
    }
  }

  render() {
    if (!this.state.plant) return null
    const { plant, text, rows, buttonText } = this.state //* text field in state

    return (
      <div className="media-content">
        <form onSubmit={this.commentHandleSubmit}>
          <div className="field">
            <p className="control">
              <textarea
                className="textarea"
                placeholder="Enter your comment here"
                name="text"
                onChange={this.commentHandleChange}
                value={text}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button type="submit" className="button post-comment-button">Post Comment</button>
            </p>
            <br />
          </div>
        </form>
        <div>
          <article className="media">
            <div className="media-content">
              <div className="content">
                {plant.comments.slice(0, rows).map((comment, index) => {
                  return (
                    <div className="item" key={index}>
                      <p>
                        <strong>{comment.user.name}</strong>
                      </p>
                      <p> {comment.text} </p>
                      {isOwner(comment.user._id) &&
                        <button className="delete comment-delete-button" comment-id={comment._id}
                          onClick={this.commentHandleDelete}>Delete
                        </button>}
                      <hr />
                    </div>
                  )
                })}
                {this.state.plant.comments.length > 3 &&
                <button className="button show-more-less-button" onClick={this.toggleCommentsHandleClick}>{buttonText}</button>}
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

}

export default Comments

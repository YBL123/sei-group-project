import React from 'react'

import { getAllChats, sendMessage, getPortfolio } from '../../lib/api'


class Chat extends React.Component {
  state = {
    chats: null,
    user: null,
    text: '',
    isMessage: false,
    chatUser: ''
  }

  async componentDidMount() {
    try {
      const res = await getAllChats()
      this.setState({ chats: res.data })
      await this.componentDidMountUser()
    } catch (err) {
      console.log(err)
    }
  }

  async componentDidMountUser() {
    try {
      const res = await getPortfolio()
      this.setState({ user: res.data })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = (event) => {
    const message = { ...this.state.text, [event.target.name]: event.target.value }
    this.setState({ message })
  }

  handleSubmit = async (event, chatid) => {
    event.preventDefault()
    try {
      const res = await sendMessage(chatid, this.state.message)
      this.setState({ message: res.data })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  handleUser = async (event, user) => {
    event.preventDefault()
    try {
      this.setState({ chatUser: user })
      this.clicker()
    } catch (err) {
      console.log(err)
    }
  }

  clicker = () => {
    this.setState({ isMessage: this.state.isMessage === false ? true : false })
  }

  render() {
    const { chats, message } = this.state
    if (!this.state.user) return null
    // console.log('Chats: ', this.state.chats)
    // console.log(this.state.chatUser)
    return (
      <>
        <h1 className="title is-3 chat-title">Your Inbox:</h1>
        <h1 className="title is-3 chat-title">{this.state.chats.length < 1 ? 'You have no open chats' : ''}</h1>
        <main className="chat-section">
          <div className="chatFormContainer">
            <form>
              {this.state.chats.map(chat => {
                let counter = 0
                let showForm = true
                let textedUser = ''
                let showUser = true
                let userCounter = 0
                if (chat.senderName == this.state.user.name) {
                  textedUser = chat.receiverName
                }
                if (chat.receiverName == this.state.user.name) {
                  textedUser = chat.senderName
                }

                return chat.subChat.map(message => {
                  counter++
                  if (counter > 1) {
                    showForm = false
                  }
                  if (counter > 1) {
                    showUser = false
                  }
                  return <>
                    {showForm &&
                      <>
                        <button
                          onClick={(event) => {
                            this.handleUser(event, textedUser)
                          }}
                          className='button'
                        >{textedUser}</button>
                      </>
                    }
                    {/* {this.state.chatUser !== textedUser ? showForm === true : showForm === false && */}
                    <>
                      {this.state.isMessage &&
                        <>
                          {showUser &&
                            <>
                              <span className='title is-4 chat-header'>Chat with {textedUser}</span>
                            </>
                          }
                          <div className="chat-text"><span className="chat-date">{message.updatedAt.split('2020-').join(' ').split('T').join(' ').split('.').splice(0, 1)}</span>
                            {message.text}</div>

                          <hr />

                          <div className="chatForm">
                            <textarea
                              className="textarea"
                              rows="2" cols="70"
                              name="text"
                              onChange={this.handleChange}
                            />
                            <button
                              onClick={(event) => {
                                this.handleSubmit(event, chat._id)
                              }}
                              className='button'>Send</button>
                          </div>

                        </>
                      }
                    </>

                  </>
                })
              })
              }
            </form>
          </div>
        </main>
      </>
    )
  }
}

export default Chat

import React from 'react'
import { registerUser, loginUser } from '../../lib/api'
import { Redirect } from 'react-router-dom'
import { setToken } from '../../lib/auth'


class Register extends React.Component {
  state = {
    formData: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    redirect: false,
    loading: false,
    errors: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  }

  handleChange = event => {
    console.log('change evet: ', event.target.name)
    const formData = { ...this.state.formData, [event.target.name]: event.target.value }
    const errors = { ...this.state.errors, [event.target.name]: '' }
    this.setState({ formData, errors })
  }



  handleSubmit = async event => {
    event.preventDefault()
    try {
      this.setState({loading: true})
      const response = await registerUser(this.state.formData)
      
      //If registration goes well, run the login user function with the formdata, then set token and redirect to profile page
      if (response.status === 201){
        const loginResponse = await loginUser(this.state.formData)
        setToken(loginResponse.data.token)
        this.setState({ redirect: true })
      }
      if(response.status === 422) throw new Error()
    } catch (err) {
      console.log('response: ', err.response.data.errors)
      //need to send handleErrors function the errors array from the 422 response as args
      this.handleErrors(err.response.data.errors)
      this.setState({ loading: false })
    }
  }

  handleErrors = (errors) => {
    let name = ''
    let email = ''
    let password = ''
    let passwordConfirmation = ''
    if(errors.name){
      name = 'Your Name Is Required'
    }
    if (errors.email && errors.email.kind === 'required'){
      email= 'Your email Is Required'
    }
    if (errors.email && errors.email.kind === 'unique'){
      email= 'You already have an account, go to sign in'
    }
    if (errors.password) {
      password = 'Password is required'
    }
    if (errors.passwordConfirmation){
      passwordConfirmation = 'Password confirmation does not match'
    }
    this.setState({ errors: { name, email, password, passwordConfirmation}})
  }

  renderRedirect = () => {
    if(this.state.redirect){
      return <Redirect to="/plants" />
    }
  }

  sendData = () => {
    this.props.switchForm(false)
  }

  render() {
    const { formData, errors } = this.state
    // console.log(this.state)
    return (
      <section className="section">
        {this.renderRedirect()}
        <div className="">
          <div className="columns">
            <form onSubmit={this.handleSubmit} className="column">
              <h1 className="has-text-centered">Sign Up Here</h1><br />
              <div className="field">
                {/* <label className="label">Name</label> */}
                <div className="control">
                  <input
                    className={`input ${errors.name ? 'is-danger' : ''}`}
                    placeholder="Name"
                    name="name"
                    onChange={this.handleChange}
                    value={formData.name}
                  />
                </div>
                {errors.name ? <small className="help is-danger">{errors.name}</small> : ''}
              </div>
              <div className="field">
                {/* <label className="label">Email</label> */}
                <div className="control">
                  <input
                    className={`input ${errors.email ? 'is-danger' : ''}`}
                    placeholder="Email"
                    name="email"
                    onChange={this.handleChange}
                    value={formData.email}
                  />
                </div>
                {this.state.errors.email ? <small className="help is-danger">{errors.email}</small> : ''}
              </div>
              <div className="field">
                {/* <label className="label">Password</label> */}
                <div className="control">
                  <input
                    className={`input ${errors.password ? 'is-danger' : ''}`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleChange}
                    value={formData.password}
                  />
                </div>
                {errors.password && <small className="help is-danger">{errors.password}</small>}
              </div>
              <div className="field">
                {/* <label className="label">Password Confirmation</label> */}
                <div className="control">
                  <input
                    type="password"
                    className={`input ${errors.passwordConfirmation ? 'is-danger' : ''}`}
                    placeholder="Password Confirmation"
                    name="passwordConfirmation"
                    onChange={this.handleChange}
                    value={formData.passwordConfirmation}
                  />
                </div>
                {errors.passwordConfirmation && <small className="help is-danger">{errors.passwordConfirmation}</small>}
              </div>
              <div className="field">
                <button type="submit" className={`button is-fullwidth register-button ${this.state.loading ? 'is-loading' : ''}`}>Register</button>
              </div>
              <div className="field">
              
                <button onClick={this.sendData}type="button" className="button is-fullwidth is-dark is-outlined">Have an account? Sign in Here</button>
              
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

export default Register

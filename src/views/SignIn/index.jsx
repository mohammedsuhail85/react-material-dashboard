import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';
import firebase from '../../Firebase';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Google as GoogleIcon } from 'icons';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

//Firebase Config
const app = firebase.app();

class SignIn extends Component {
  state = {
    values: {
      email: '',
      password: ''
    },
    touched: {
      email: false,
      password: false
    },
    errors: {
      email: null,
      password: null
    },
    isValid: false,
    isLoading: false,
    submitError: null,
    isSignedIn: false,
    user: {},
    passwordError: false,
    emailError: false,
    passwordErrorMessage: '',
    emailErrorMessage: ''
  };

  signIn = (email, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            this.setState({ isSignedIn: !!res })
            this.setState({ user: res })
            return res;
          }).catch((err) => {
            return err;
          })
        );
      }, 1500);
    });
  };

  signOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('sign out')
    }).catch((err) => {
      console.log('error' + err)
    })
  }

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  handleSignIn = async (e) => {
    try {
      const { history } = this.props;
      const { values } = this.state;

      if (!this.state.touched.email && !this.state.touched.password) {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        app.auth().signInWithPopup(googleProvider).then(res => {
          this.setState({ isSignedIn: !!res })
          this.setState({ user: res })
          localStorage.setItem('isAuthenticated', this.state.isSignedIn);
          if (this.state.isSignedIn) {
            history.push('/dashboard');
          }
        });
      }

      this.setState({ isLoading: true });

      if (this.state.touched.email && this.state.touched.password) {
        const res = await this.signIn(values.email, values.password);

        console.log(res)

        if (res.code === "auth/user-not-found") {
          this.setState({ emailError: true })
          this.setState({ emailErrorMessage: 'Invalid Email' })
          this.setState({ isLoading: false })
        } else if (res.code === "auth/wrong-password") {
          this.setState({ emailErrorMessage: '' })
          this.setState({ passwordErrorMessage: 'Invalid Password' })
          this.setState({ emailError: false })
          this.setState({ passwordError: true })
          this.setState({ isLoading: false })
        } else if (res.code === "auth/too-many-requests") {
          this.setState({ emailErrorMessage: '' })
          this.setState({ passwordErrorMessage: 'Invalid Password' })
          this.setState({ emailError: false })
          this.setState({ passwordError: true })
          this.setState({ isLoading: false })
        } else {
          localStorage.setItem('isAuthenticated', this.state.isSignedIn);
          if (this.state.isSignedIn) {
            history.push('/dashboard');
          }
        }
      }

    } catch (error) {
      this.setState({
        isLoading: false,
        serviceError: error
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading
    } = this.state;

    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.quoteWrapper}
            item
            lg={5}
          >
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography
                  className={classes.quoteText}
                  variant="h1"
                >
                  Online Food Delivery Service
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    Takamaru Ayako
                  </Typography>
                  <Typography
                    className={classes.bio}
                    variant="body2"
                  >
                    Manager at inVision
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    Sign in with social media
                  </Typography>
                  <Button
                    className={classes.googleButton}
                    name="googleLogin"
                    onClick={this.handleSignIn}
                    size="large"
                    variant="contained"
                  >
                    <GoogleIcon className={classes.googleIcon} />
                    Login with Google
                  </Button>
                  <Typography
                    className={classes.sugestion}
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Email address"
                      name="email"
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      type="text"
                      value={values.email}
                      variant="outlined"
                      error={this.state.emailError}
                    />
                    {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.email[0]}
                      </Typography>
                    )}
                    <Typography
                      className={classes.fieldError}
                      variant="body2"
                    >
                      {this.state.emailErrorMessage}
                    </Typography>
                    <TextField
                      className={classes.textField}
                      label="Password"
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      type="password"
                      value={values.password}
                      variant="outlined"
                      error={this.state.passwordError}
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.password[0]}
                      </Typography>
                    )}
                    <Typography
                      className={classes.fieldError}
                      variant="body2"
                    >
                      {this.state.passwordErrorMessage}
                    </Typography>
                  </div>
                  {submitError && (
                    <Typography
                      className={classes.submitError}
                      variant="body2"
                    >
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                      <Button
                        className={classes.signInButton}
                        color="primary"
                        disabled={!isValid}
                        onClick={this.handleSignIn}
                        size="large"
                        variant="contained"
                      >
                        Sign in now
                    </Button>
                    )}
                  <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    Don't have an account?{' '}
                    <Link
                      className={classes.signUpUrl}
                      to="/sign-up"
                    >
                      Sign up
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignIn);

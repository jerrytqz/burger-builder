import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input'; 
import Button from '../../components/UI/Button/Button'; 
import classes from './Auth.css'; 
import * as actions from '../../store/actions/index'; 
import {connect} from 'react-redux'; 
import Spinner from '../../components/UI/Spinner/Spinner'; 
import {Redirect} from 'react-router-dom'; 
import {updateObject, checkValidity} from '../../shared/utility'; 

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                lowercasePlaceholder: 'email', 
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                lowercasePlaceholder: 'password',
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm'
                },
                lowercasePlaceholder: 'password',
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignIn: true,
        formIsValid: false 
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath(); 
        }
        this.props.onResetErrors(); 
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        })   
        let formIsValid = true;
        for (let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid; 
        }
        this.setState({controls: updatedControls, formIsValid: formIsValid});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignIn, this.state.controls.confirmPassword.value);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignIn: !prevState.isSignIn}; 
        })
    }
    
    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            }); 
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key = {formElement.id}
                elementType = {formElement.config.elementType}
                elementConfig = {formElement.config.elementConfig}
                value = {formElement.config.value} 
                invalid = {!formElement.config.valid}
                shouldValidate = {formElement.config.validation}
                touched = {formElement.config.touched}
                changed = {(event) => this.inputChangedHandler(event, formElement.id)}
                valueType = {formElement.config.lowercasePlaceholder}/>
        ))

        if (this.state.isSignIn) {
            form.length = 2;
        }

        if (this.props.loading) {
            form = <Spinner />; 
        }

        let errorMessage = null; 
        if (this.props.error) {
            if (this.props.error.message === 'INVALID_EMAIL')
            errorMessage = (
                <p style = {{color: 'red'}}>The email you have entered is invalid.</p>
            ); 
            else if (this.props.error.message === 'EMAIL_EXISTS')
            errorMessage = (
                <p style = {{color: 'red'}}>The email you have entered is already in use.</p>
            ); 
            else if (this.props.error.message === 'OPERATION_NOT_ALLOWED')
            errorMessage = (
                <p style = {{color: 'red'}}>Password sign-in has been disabled.</p>
            ); 
            else if (this.props.error.message === 'TOO_MANY_ATTEMPTS_TRY_LATER')
            errorMessage = (
                <p style = {{color: 'red'}}>Too many attempts have been made. Try again later.</p>
            ); 
            else if (this.props.error.message === 'EMAIL_NOT_FOUND')
            errorMessage = (
                <p style = {{color: 'red'}}>The email you have entered could not be found.</p>
            ); 
            else if (this.props.error.message === 'INVALID_PASSWORD')
            errorMessage = (
                <p style = {{color: 'red'}}>The password you have entered is incorrect or invalid.</p>
            ); 
            else if (this.props.error.message === 'USER_DISABLED')
            errorMessage = (
                <p style = {{color: 'red'}}>Your account has been disabled.</p>
            ); 
            else {
                errorMessage = (
                    <p style = {{color: 'red'}}>{this.props.error.message}</p>
                ); 
            }
        }

        let passwordError = null;
        if (this.props.passwordFailedToMatch) 
        passwordError = (
            <p style = {{color: 'red'}}>The passwords you have entered do not match.</p>
        ); 

        let redirectAuth = null; 
        if (this.props.isAuthenticated) {
            redirectAuth = <Redirect to = {this.props.authRedirectPath} />
        }
        
        let formIsValidIsSignIn = this.state.isSignIn && this.state.controls.email.valid && this.state.controls.password.valid;
        return(
            <div className = {classes.Auth}>
                {passwordError}
                {errorMessage}
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType = "Success" disabled = {!this.state.formIsValid && !formIsValidIsSignIn}>{this.state.isSignIn ? 'SIGN IN ' : 'SIGN UP '}</Button>
                </form>
                <Button 
                    clicked = {this.switchAuthModeHandler}
                    btnType = 'Danger'>{this.state.isSignIn ? 'SIGN UP ' : 'SIGN IN '} INSTEAD</Button>
                {redirectAuth}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
        passwordFailedToMatch: state.auth.passwordFailedToMatch 
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignIn, confirmedPassword) => dispatch(actions.auth(email, password, isSignIn, confirmedPassword)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        onResetErrors: () => dispatch(actions.resetErrors()) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth); 
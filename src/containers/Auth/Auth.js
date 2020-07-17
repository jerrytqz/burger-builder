import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input'; 
import Button from '../../components/UI/Button/Button'; 
import classes from './Auth.css'; 
import * as actions from '../../store/actions/index'; 
import {connect} from 'react-redux'; 
import Spinner from '../../components/UI/Spinner/Spinner'; 
import {Redirect} from 'react-router-dom'; 

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
            }
        },
        isSignIn: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath(); 
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid; 
        }

        if (rules.length) {
            isValid = value.length === rules.length && isValid; 
        }

        if (rules.isEmail) {
            const pattern = /\S+@\S+\.\S+/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        return isValid; 
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls})
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignIn);
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
                <p style = {{color: 'red'}}>Too many attempts have been made. Try later.</p>
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

        let redirectAuth = null; 
        if (this.props.isAuthenticated) {
            redirectAuth =  <Redirect to = {this.props.authRedirectPath} />
        }

        return(
            <div className = {classes.Auth}>
                {errorMessage}
                <form onSubmit = {this.submitHandler}>
                    {form}
                    <Button btnType = "Success">{this.state.isSignIn ? 'SIGN IN ' : 'SIGN UP '}</Button>
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
        authRedirectPath: state.auth.authRedirectPath 
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignIn) => dispatch(actions.auth(email, password, isSignIn)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth); 
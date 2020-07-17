import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css'; 
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'; 
import Input from '../../../components/UI/Input/Input'; 
import {connect} from 'react-redux'; 
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'; 
import * as actions from '../../../store/actions/index'; 

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                lowercasePlaceholder: 'name', 
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street' 
                },
                lowercasePlaceholder: 'street',
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            postCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postcode'   
                },
                lowercasePlaceholder: 'postcode', 
                value: '',
                validation: {
                    required: true,
                    length: 6
                },
                valid: false,
                touched: false 
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                lowercasePlaceholder: 'country', 
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false 
            },
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
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fast', displayValue: 'Fast'},
                        {value: 'casual', displayValue: 'Casual'},
                        {value: 'slow', displayValue: 'Slow'}
                    ]
                },
                validation: {},
                value: 'fast', 
                valid: true
            },
        },
        formIsValid: false  
    }

    orderHandler = (event) => {
        event.preventDefault(); 
        // console.log(this.props.ingredients);
            const formData = {};
            for (let formElementIdentifier in this.state.orderForm) {
                formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
            }
            const order = {
                ingredients: this.props.ings, 
                price: Number(this.props.price).toFixed(2), // Not a real setup, recalculate price on server 
                contactData: formData,
                userId: this.props.userId 
            }
            this.props.onOrderBurger(order, this.props.token); 
    }

    checkValidity(value, rules) {
        let isValid = true;
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid; 
        }

        // if (rules.minLength) {
        //     isValid = value.length >= rules.minLength && isValid; 
        // }

        // if (rules.maxLength) {
        //     isValid = value.length <= rules.maxLength && isValid;  
        // }

        if (rules.isEmail) {
            const pattern = /\S+@\S+\.\S+/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.length) {
            isValid = value.length === rules.length && isValid; 
        }

        return isValid; 
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm 
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value; 
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, 
            updatedFormElement.validation); 
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid; 
        }
        updatedFormElement.touched = true; 
        // console.log(updatedFormElement); 
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid}); 
}   

    render() {
        const formElementsArray = [];

        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            }); 
        }

        let form = (
            <div>
                <h4>Please enter your contact data</h4>
                <form onSubmit = {this.orderHandler}>
                    {formElementsArray.map(formElement => (
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
                    ))}
                    <Button 
                        btnType = "Success" 
                        clicked = {this.orderHandler}
                        disabled = {!this.state.formIsValid}>ORDER</Button>
                </form>
            </div>
        );

        if (this.props.loading) {
            form = <Spinner />
        }

        if (this.props.error) {
            form = <p style = {{textAlign: 'center'}}>Something went wrong...</p>
        }
        
        return(
            <div className = {classes.ContactData}>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        error: state.order.error,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios)); 
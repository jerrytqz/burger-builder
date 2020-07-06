import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal'; 
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'; 
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'; 
import Spinner from '../../components/UI/Spinner/Spinner'; 

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,  
        totalPrice: 1.5,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false   
    };

    componentDidMount() {
        axios.get('ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data}); 
            })
            .catch(error => {
                this.setState({error: true}); 
            });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            }) 
            .reduce((sum, el) => {
                return sum + el; 
            }, 0); 
        this.setState({purchasable: sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        const updatedCount = oldCount + 1; 
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount; 
        const priceAddition = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        if (oldCount <= 0) {
            return; 
        }
        const updatedCount = oldCount - 1; 
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount; 
        const priceDeduction = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false}); 
    }

    purchaseProceedHandler = () => {
        // alert('PROCEED'); 
        this.setState({loading: true}); 
        const order = {
            ingredients: this.state.ingredients, 
            price: this.state.totalPrice.toFixed(2), // Not a real setup, recalculate price on server 
            customer: {
                name: 'Jerry Zheng',
                address: {
                    street: '69 Street',
                    zipCode: 'V4N6M9',
                    country: 'Canada'
                },
                email: '69@69.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false}); 
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false}); 
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients 
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null; 
        let burger = this.state.error ? <p style = {{textAlign: 'center'}}>Ingredients failed to load!</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientRemoved = {this.removeIngredientHandler}
                        disabled = {disabledInfo}
                        purchasable = {this.state.purchasable}
                        ordered = {this.purchaseHandler} 
                        price = {this.state.totalPrice}/>
                </Aux>
            );
            
            orderSummary = (
            <OrderSummary 
                price = {this.state.totalPrice}
                ingredients = {this.state.ingredients}
                purchaseProceeded = {this.purchaseProceedHandler}
                purchaseCanceled = {this.purchaseCancelHandler}/>
            );

            if (this.state.loading) {
                orderSummary = <Spinner />
            }
        }

        return(
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios); 

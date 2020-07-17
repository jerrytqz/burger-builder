import React, {Component} from 'react'; 
import Order from '../../components/Order/Order'; 
import axios from '../../axios-orders'; 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'; 
import Spinner from '../../components/UI/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index'; 

class Orders extends Component {
    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId); 
    }
    
    render() {
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = this.props.orders.map(order => (
                <Order 
                    key = {order.id}
                    ingredients = {order.ingredients}
                    price = {order.price}/>
            )); 
        }

        if (orders.length === 0) {
            orders = <p style = {{textAlign: 'center'}}>You currently have no pending orders.</p>
        }

        if (this.props.error) {
            orders = <p style = {{textAlign: 'center'}}>Orders failed to fetch!</p>
        }

        return(
            <div>
                {orders}
            </div>
        ); 
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        error: state.order.errorOrder,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios)); 
import React, { useEffect, useState } from 'react';
import './Shop.css';
import Product from './Product/Product';
import Cart from './Cart/Cart';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../utilities/fakedb';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])

    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);


    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 01: get id
        for (const id in storedCart) {
            // step 02: get the product from products state by using id
            const addedProduct = products.find(product => product.id === id);
            if (addedProduct) {
                // step 03: get the quantity of the product
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 04: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('addeded product',addedProduct);
        }
        // step 05: set the cart
        setCart(savedCart);
    }, [products])


    const handleAddToCart = (product) => {
        // cart.push(product);
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in th cart, then set quantity = 1
        // if exist update quantity by 1

        const exists = cart.find(pd => pd.id === product.id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);
            newCart = [...remaining, exists];
        }


        setCart(newCart);
        addToDb(product.id);
    };

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }


    return (
        <div className='shop-container'>
            <div className="product-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order
                        <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </Link>
                </Cart>

            </div>
        </div>
    );
};

export default Shop;
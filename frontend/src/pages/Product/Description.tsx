import React from "react";
import CartIcon from "./Icons/CartIcon";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Description = ({ productDetails, onQuant, onAdd, onRemove, onSetOrderedQuant, handleBuyNow, handleAddToCart }) => {
  return (
    <section className="description">
      <h1>{productDetails.name}</h1>
      <p className="desc">
        {productDetails.description}
      </p>
      <div className="price">
        <div className="main-tag">
          <p>{productDetails.price} $</p>
          {productDetails.discount && <p>{productDetails.discount}</p>}
        </div>
        {productDetails.discount && <s>{productDetails?.discountPriceWere}</s>}
      </div>
      <div className="buttons">
        <button
          className="add-to-cart"
          onClick={() => {
            handleAddToCart(onQuant);
          }}
        >
          <CartIcon />
          add to cart
        </button>
        <button
          className="add-to-cart buy-now"
          onClick={() => {
            handleBuyNow(onQuant);
          }}
        >
          <AttachMoneyIcon/>
          buy now
        </button>
      </div>
    </section>
  );
};

export default Description;

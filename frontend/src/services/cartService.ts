import appAxios from './appAxios';

export const cartService = {
  // Get cart items
  getCart: async () => {
    const response = await appAxios.get('/carts');
    return response.data;
  },
  
  // Add product to cart
  addProduct: async (productId: number) => {
    const response = await appAxios.post('/carts/add-product', {
      product_id: productId
    });
    return response.data;
  },
  
  // Remove product from cart
  removeProduct: async (productId: number) => {
    const response = await appAxios.delete(`/carts/remove-product/${productId}`);
    return response.data;
  },
  
  // Clear cart
  clearCart: async () => {
    const response = await appAxios.delete('/carts/clear');
    return response.data;
  }
};
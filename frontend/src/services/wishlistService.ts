import appAxios from './appAxios';

export const wishlistService = {
  // Get wishlist items
  getWishlist: async () => {
    const response = await appAxios.get('/wishlist');
    return response.data;
  },
  
  // Add product to wishlist
  addToWishlist: async (productId: number) => {
    const response = await appAxios.post('/wishlist/add-product', {
      product_id: productId
    });
    return response.data;
  },
  
  // Remove product from wishlist
  removeFromWishlist: async (productId: number) => {
    const response = await appAxios.delete(`/wishlist/remove-product/${productId}`);
    return response.data;
  },
  
  // Clear wishlist
  clearWishlist: async () => {
    const response = await appAxios.delete('/wishlist/clear');
    return response.data;
  }
};
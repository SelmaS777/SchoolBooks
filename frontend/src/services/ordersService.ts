import appAxios from './appAxios';

export interface Order {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  total_amount: string;
  order_status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  tracking_status: 'order_placed' | 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  shipping_address: string;
  notes?: string;
  accepted_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    seller_id: number;
    name: string;
    author: string;
    description: string;
    price: string;
    category_id: number;
    image_url: string;
    state_id: number;
    year_of_publication: number;
    created_at: string;
    updated_at: string;
    status: string;
    buyer_id: number | null;
  };
  buyer: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    image_url: string | null;
    personal_details: string | null;
    created_at: string;
    updated_at: string;
    city_id: number | null;
    tier_id: number | null;
  };
  seller: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    image_url: string | null;
    personal_details: string | null;
    created_at: string;
    updated_at: string;
    city_id: number | null;
    tier_id: number | null;
  };
  payment: {
    id: number;
    order_id: number;
    card_id: number;
    payment_method: string;
    payment_status: string;
    payment_amount: string;
    transaction_id: string | null;
    payment_gateway_response: string | null;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateOrderParams {
  product_id: number;
  shipping_address: string;
  payment_method: string;
  card_id?: number;
  card_number?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
  cardholder_name?: string;
  save_card?: boolean;
  notes?: string;
}

export const ordersService = {
  // Get all orders for the current user (as buyer or seller)
  getOrders: async (): Promise<Order[]> => {
    const response = await appAxios.get('/orders');
    return response.data;
  },

  // Create a new order
  createOrder: async (params: CreateOrderParams): Promise<Order> => {
    const response = await appAxios.post('/orders', params);
    return response.data;
  },

  // Accept an order (seller only)
  acceptOrder: async (id: number): Promise<void> => {
    await appAxios.post(`/orders/${id}/accept`);
  },

  // Reject an order (seller only)
  rejectOrder: async (id: number): Promise<void> => {
    await appAxios.post(`/orders/${id}/reject`);
  },

  // Mark order as shipped (seller only)
  shipOrder: async (id: number): Promise<void> => {
    await appAxios.post(`/orders/${id}/ship`);
  },

  // Complete an order (buyer confirms receipt)
  completeOrder: async (id: number): Promise<void> => {
    await appAxios.post(`/orders/${id}/complete`);
  }
};
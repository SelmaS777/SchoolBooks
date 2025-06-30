export interface Subcategory {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export enum ProductStatus {
  SELLING = "selling",
  SOLD = "sold",
  BOUGHT = "bought"
}

export interface Product {
  id: number;
  seller_id: number;
  name: string;
  author: string;
  description: string;
  price: number | string;
  category_id: number;
  image_url: string;
  state_id: number;
  year_of_publication: number;
  created_at: string;
  updated_at: string;
  status?: ProductStatus;     // "selling", "sold", or "bought"
  buyer_id?: number | null;    
  category?: Category;
  state?: State;
  seller?: User;
  buyer?: User | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  password_confirmation: string;
  phoneNumber: string;
}

export interface AddNewProductOnSaleModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  image_url?: string;            // Backend property for user image
  personal_details?: string;     // Backend property for user bio
  created_at?: string;
  updated_at?: string;
  city_id?: number;
  tier_id?: number;
  city?: City;
  
  // Keeping for backward compatibility
  avatarUrl?: string;           // @deprecated Use image_url instead
  bio?: string;                 // @deprecated Use personal_details instead
  location?: string;            // @deprecated No longer supported in backend
  interests?: string;           // @deprecated No longer supported in backend
}

export interface UserProfile extends User {
  created_at: string;
  updated_at: string;
}

export interface TokenPayload {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
  user: User;
}


export type NewProduct = Omit<Product, "id" | "created_at" | "updated_at">;

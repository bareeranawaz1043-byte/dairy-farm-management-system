export type Cow = {
  _id: string;
  name: string;
};

export type Sale = {
  _id: string;
  cow: Cow;          
  quantity: number;
  price: number;
  total: number;
  date: string;      
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSaleDTO = {
  cow: string;       
  quantity: number;
  price: number;
  date?: string;
};

export type SalesResponse = {
  success: boolean;
  data: Sale[];
  count?: number;
};
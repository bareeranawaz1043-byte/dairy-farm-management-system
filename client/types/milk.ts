export type Milk = {
  _id: string;
  quantity: number;
  date: string;

  cow: {
    _id: string;
    name: string;
  };
};
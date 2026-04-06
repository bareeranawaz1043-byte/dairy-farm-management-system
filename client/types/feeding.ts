export type Feeding = {
  _id: string;
  feedType: string;
  quantity: number;
  date: string;

  cow: {
    _id: string;
    name: string;
  };
};
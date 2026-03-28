export type Cow = {
  _id: string;
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health?: "healthy" | "sick";
  vaccination?: string;
};
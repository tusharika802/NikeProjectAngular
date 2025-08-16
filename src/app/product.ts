export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  sizes: string[];    // ['UK 6', 'UK 7', ...]

}
import { SaleProduct } from '.';

export class SaleDetails {
    id: number;
    label: string;
    description: string;
    products?: SaleProduct[];
    children?: SaleDetails[];
    detailsProducts: boolean;
    detailsWithProducts: boolean;
}

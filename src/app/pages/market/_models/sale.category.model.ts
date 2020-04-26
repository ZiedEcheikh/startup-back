import { SaleSubCategory } from '.';

export interface SaleCategory {
    id: number;
    label: string;
    subCategories?: SaleSubCategory[];
}

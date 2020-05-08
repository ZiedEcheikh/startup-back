import { SaleCategory } from './sale.category.model';
import { SaleSubCategory } from './sale.sub.category.model';
import { SaleDetails } from './sale.details.model';

export class Sale  {
    id?: number;
    label: string;
    description: string;
    beginDate: string;
    endDate: string;
    category: SaleCategory;
    subCategory?: SaleSubCategory;
    enable: boolean;
    draft: boolean;
    userId: string;
    details?: SaleDetails[];
    public constructor() {
    }

    public buildSale(label: string, description: string,
                     beginDate: Date, endDate: Date, category: SaleCategory,
                     enable: boolean, draft: boolean, subCategory?: SaleSubCategory) {
        this.label = label;
        this.description = description;
        this.beginDate = beginDate.toISOString();
        this.endDate = endDate.toISOString();
        this.category = category;
        this.subCategory = subCategory;
        this.draft = draft;
        this.enable = enable;
        return this;
    }

    public buildSaleWithId(id: number){
        this.id = id;
        return this;
    }
}

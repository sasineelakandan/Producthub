
export type ProductFormData = {
    Id: number;
    ItemCategoryId: number;
    SKU: number;
    ItemName: string;
    CostOfGoods: number;
    SellingPrice: number;
    OpeningStock: number;
    OpeningStockDate: string;
    IsInventory: boolean;
    GSTApplicable: boolean;
  };
  
  export interface Product {
    Id: number;
    ItemName: string;
    Category: string;
    SellingPrice: number;
    ImagePath: string;
    CostOfGoods?: number;
    GSTApplicable?: boolean;
    OpeningStock?: number;
    OpeningStockDate?: string;
    SKU?: string;
    Rating?: number;
    Description?: string;
  }
  
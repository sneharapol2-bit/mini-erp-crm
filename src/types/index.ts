export type Role = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type CustomerType = 'Retail' | 'Wholesale' | 'Distributor';
export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';

export interface FollowUpNote {
  id: string;
  note: string;
  date: string;
  createdBy: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  type: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate: string;
  notes: string;
  followUpHistory: FollowUpNote[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  warehouseLocation: string;
}

export type StockMovementType = 'IN' | 'OUT';

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityChanged: number;
  movementType: StockMovementType;
  reason: string;
  createdBy: string;
  timestamp: string;
}

export type ChallanStatus = 'Draft' | 'Confirmed' | 'Cancelled';

export interface ChallanItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  customerMobile?: string;
  customerAddress?: string;
  items: ChallanItem[];
  totalQuantity: number;
  totalAmount: number;
  status: ChallanStatus;
  createdBy: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  notes?: string;
}

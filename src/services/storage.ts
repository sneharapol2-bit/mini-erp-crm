import { User, Customer, Product, StockLog, Challan, Role, FollowUpNote } from '../types';

export const DEMO_USERS: Record<Role, User> = {
  Admin: {
    id: 'usr_admin',
    name: 'Rajesh Kumar (Admin)',
    email: 'admin@company.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  Sales: {
    id: 'usr_sales',
    name: 'Priya Sharma (Sales Exec)',
    email: 'priya.sales@company.com',
    role: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  Warehouse: {
    id: 'usr_warehouse',
    name: 'Vikram Singh (Warehouse Lead)',
    email: 'vikram.wh@company.com',
    role: 'Warehouse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  Accounts: {
    id: 'usr_accounts',
    name: 'Ananya Roy (Accounts Manager)',
    email: 'ananya.acc@company.com',
    role: 'Accounts',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Apex Wholesale Traders',
    mobile: '+91 98765 43210',
    email: 'contact@apexwholesale.com',
    businessName: 'Apex Enterprises Pvt Ltd',
    gstNumber: '27AAACA123411Z5',
    type: 'Wholesale',
    address: 'Plot 42, GIDC Industrial Estate, Sector 18, Gurugram, HR',
    status: 'Active',
    followUpDate: '2026-07-25',
    notes: 'Requested bulk discount for Q3 hardware stock.',
    createdAt: '2026-07-01',
    followUpHistory: [
      {
        id: 'fn_1',
        note: 'Initial inquiry regarding solar inverter components.',
        date: '2026-07-05',
        createdBy: 'Priya Sharma (Sales Exec)',
        timestamp: '2026-07-05 11:30 AM'
      },
      {
        id: 'fn_2',
        note: 'Sent formal price list and credit terms document.',
        date: '2026-07-15',
        createdBy: 'Priya Sharma (Sales Exec)',
        timestamp: '2026-07-15 03:45 PM'
      }
    ]
  },
  {
    id: 'cust_2',
    name: 'Metro Retail Outlets',
    mobile: '+91 91234 56789',
    email: 'procurement@metroretail.in',
    businessName: 'Metro Chains Ltd',
    gstNumber: '07BBBCC9876M1Z2',
    type: 'Retail',
    address: 'Shop 104, Connaught Place, New Delhi, DL',
    status: 'Lead',
    followUpDate: '2026-07-23',
    notes: 'Interested in electronic accessories catalog. Follow up on product samples.',
    createdAt: '2026-07-10',
    followUpHistory: [
      {
        id: 'fn_3',
        note: 'Sample catalog dispatched via express courier.',
        date: '2026-07-12',
        createdBy: 'Priya Sharma (Sales Exec)',
        timestamp: '2026-07-12 10:15 AM'
      }
    ]
  },
  {
    id: 'cust_3',
    name: 'National Logistics Hub',
    mobile: '+91 99887 76655',
    email: 'supply@nationallogistics.com',
    businessName: 'National Logistics & Distribution',
    gstNumber: '29XYZPD4567K1Z9',
    type: 'Distributor',
    address: 'Warehouse A3, Logistics Park, Electronic City, Bengaluru, KA',
    status: 'Active',
    followUpDate: '2026-07-28',
    notes: 'Key regional distributor for South India region. Monthly credit account active.',
    createdAt: '2026-06-20',
    followUpHistory: []
  },
  {
    id: 'cust_4',
    name: 'Global Tech Resellers',
    mobile: '+91 95554 33221',
    email: 'info@globaltechresellers.in',
    businessName: 'Global Tech Solutions',
    gstNumber: '',
    type: 'Retail',
    address: '12 Commercial Complex, MG Road, Pune, MH',
    status: 'Inactive',
    followUpDate: '2026-08-01',
    notes: 'Payment delayed on previous invoice. Account currently paused.',
    createdAt: '2026-05-14',
    followUpHistory: []
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Industrial Microcontroller Unit (MCU v4)',
    sku: 'MCU-IND-V4',
    category: 'Electronics',
    unitPrice: 1450,
    currentStock: 120,
    minStockAlert: 25,
    warehouseLocation: 'Rack A-12, Main Warehouse'
  },
  {
    id: 'prod_2',
    name: 'Heavy Duty Power Supply 500W',
    sku: 'PSU-HD-500W',
    category: 'Power Equipment',
    unitPrice: 3200,
    currentStock: 18,
    minStockAlert: 20, // LOW STOCK ALERT TRIGGERED
    warehouseLocation: 'Rack B-04, Main Warehouse'
  },
  {
    id: 'prod_3',
    name: 'Fiber Optic Cable Reel (100m)',
    sku: 'FOB-100M-OM3',
    category: 'Networking',
    unitPrice: 4800,
    currentStock: 45,
    minStockAlert: 10,
    warehouseLocation: 'Section C, Storage Bay 2'
  },
  {
    id: 'prod_4',
    name: 'Smart Sensor Node (IoT Enabled)',
    sku: 'IOT-SSN-200',
    category: 'Sensors',
    unitPrice: 890,
    currentStock: 5,
    minStockAlert: 15, // CRITICAL LOW STOCK
    warehouseLocation: 'Rack A-02, High Value Vault'
  },
  {
    id: 'prod_5',
    name: 'DIN Rail Terminal Block Set',
    sku: 'DIN-TERM-SET',
    category: 'Hardware',
    unitPrice: 240,
    currentStock: 350,
    minStockAlert: 50,
    warehouseLocation: 'Rack D-08, Small Parts Section'
  }
];

const INITIAL_STOCK_LOGS: StockLog[] = [
  {
    id: 'log_1',
    productId: 'prod_1',
    productName: 'Industrial Microcontroller Unit (MCU v4)',
    sku: 'MCU-IND-V4',
    quantityChanged: 150,
    movementType: 'IN',
    reason: 'Initial Vendor Bulk Purchase',
    createdBy: 'Vikram Singh (Warehouse Lead)',
    timestamp: '2026-07-01 09:30 AM'
  },
  {
    id: 'log_2',
    productId: 'prod_2',
    productName: 'Heavy Duty Power Supply 500W',
    sku: 'PSU-HD-500W',
    quantityChanged: 50,
    movementType: 'IN',
    reason: 'Supplier Stock Delivery',
    createdBy: 'Vikram Singh (Warehouse Lead)',
    timestamp: '2026-07-05 02:15 PM'
  },
  {
    id: 'log_3',
    productId: 'prod_2',
    productName: 'Heavy Duty Power Supply 500W',
    sku: 'PSU-HD-500W',
    quantityChanged: 32,
    movementType: 'OUT',
    reason: 'Fulfill Sales Challan CHN-2026-001',
    createdBy: 'Vikram Singh (Warehouse Lead)',
    timestamp: '2026-07-16 11:00 AM'
  }
];

const INITIAL_CHALLANS: Challan[] = [
  {
    id: 'ch_1',
    challanNumber: 'CHN-2026-001',
    customerId: 'cust_1',
    customerName: 'Apex Wholesale Traders',
    customerMobile: '+91 98765 43210',
    customerAddress: 'Plot 42, GIDC Industrial Estate, Sector 18, Gurugram, HR',
    items: [
      {
        productId: 'prod_1',
        productName: 'Industrial Microcontroller Unit (MCU v4)',
        sku: 'MCU-IND-V4',
        unitPrice: 1450,
        quantity: 30,
        total: 43500
      },
      {
        productId: 'prod_2',
        productName: 'Heavy Duty Power Supply 500W',
        sku: 'PSU-HD-500W',
        unitPrice: 3200,
        quantity: 32,
        total: 102400
      }
    ],
    totalQuantity: 62,
    totalAmount: 145900,
    status: 'Confirmed',
    createdBy: 'Priya Sharma (Sales Exec)',
    createdAt: '2026-07-16 10:30 AM',
    confirmedAt: '2026-07-16 11:00 AM',
    notes: 'Urgent delivery confirmed via Apex logistics truck.'
  },
  {
    id: 'ch_2',
    challanNumber: 'CHN-2026-002',
    customerId: 'cust_3',
    customerName: 'National Logistics Hub',
    customerMobile: '+91 99887 76655',
    customerAddress: 'Warehouse A3, Logistics Park, Electronic City, Bengaluru, KA',
    items: [
      {
        productId: 'prod_3',
        productName: 'Fiber Optic Cable Reel (100m)',
        sku: 'FOB-100M-OM3',
        unitPrice: 4800,
        quantity: 5,
        total: 24000
      }
    ],
    totalQuantity: 5,
    totalAmount: 24000,
    status: 'Draft',
    createdBy: 'Priya Sharma (Sales Exec)',
    createdAt: '2026-07-21 04:20 PM',
    notes: 'Awaiting purchase order confirmation from client finance team.'
  }
];

// LocalStorage Persistence Service
const STORAGE_KEYS = {
  CURRENT_USER: 'erp_current_user',
  THEME: 'erp_theme',
  CUSTOMERS: 'erp_customers_v1',
  PRODUCTS: 'erp_products_v1',
  STOCK_LOGS: 'erp_stock_logs_v1',
  CHALLANS: 'erp_challans_v1',
};

// Initialize Storage
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STOCK_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.STOCK_LOGS, JSON.stringify(INITIAL_STOCK_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHALLANS)) {
    localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(INITIAL_CHALLANS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS.Admin));
  }
}

// User & Auth
export function getCurrentUser(): User {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : DEMO_USERS.Admin;
}

export function setCurrentUser(user: User) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

// Customers
export function getCustomers(): Customer[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveCustomer(customerData: Partial<Customer> & { name: string; mobile: string; email: string; businessName: string; type: Customer['type']; address: string; status: Customer['status'] }): Customer {
  const customers = getCustomers();
  const currentUser = getCurrentUser();

  if (customerData.id) {
    const index = customers.findIndex(c => c.id === customerData.id);
    if (index !== -1) {
      customers[index] = {
        ...customers[index],
        ...customerData
      };
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      return customers[index];
    }
  }

  const newCustomer: Customer = {
    id: `cust_${Date.now()}`,
    name: customerData.name,
    mobile: customerData.mobile,
    email: customerData.email,
    businessName: customerData.businessName,
    gstNumber: customerData.gstNumber || '',
    type: customerData.type,
    address: customerData.address,
    status: customerData.status,
    followUpDate: customerData.followUpDate || new Date().toISOString().split('T')[0],
    notes: customerData.notes || '',
    followUpHistory: customerData.notes ? [{
      id: `fn_${Date.now()}`,
      note: customerData.notes,
      date: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
      timestamp: new Date().toLocaleString()
    }] : [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  customers.unshift(newCustomer);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  return newCustomer;
}

export function addFollowUpNote(customerId: string, noteText: string): Customer | null {
  const customers = getCustomers();
  const currentUser = getCurrentUser();
  const index = customers.findIndex(c => c.id === customerId);

  if (index === -1) return null;

  const newNote: FollowUpNote = {
    id: `fn_${Date.now()}`,
    note: noteText,
    date: new Date().toISOString().split('T')[0],
    createdBy: currentUser.name,
    timestamp: new Date().toLocaleString()
  };

  customers[index].followUpHistory.unshift(newNote);
  customers[index].notes = noteText;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  return customers[index];
}

// Products & Stock
export function getProducts(): Product[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveProduct(productData: Partial<Product> & { name: string; sku: string; category: string; unitPrice: number; currentStock: number; minStockAlert: number; warehouseLocation: string }): Product {
  const products = getProducts();
  const currentUser = getCurrentUser();

  if (productData.id) {
    const index = products.findIndex(p => p.id === productData.id);
    if (index !== -1) {
      const oldStock = products[index].currentStock;
      const updatedProduct = {
        ...products[index],
        ...productData
      };
      products[index] = updatedProduct;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

      // If stock was edited manually, log movement
      if (oldStock !== productData.currentStock) {
        const diff = productData.currentStock - oldStock;
        addStockLog({
          productId: updatedProduct.id,
          productName: updatedProduct.name,
          sku: updatedProduct.sku,
          quantityChanged: Math.abs(diff),
          movementType: diff > 0 ? 'IN' : 'OUT',
          reason: 'Manual Inventory Adjustment',
          createdBy: currentUser.name
        });
      }

      return updatedProduct;
    }
  }

  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: productData.name,
    sku: productData.sku.toUpperCase(),
    category: productData.category,
    unitPrice: Number(productData.unitPrice),
    currentStock: Number(productData.currentStock),
    minStockAlert: Number(productData.minStockAlert),
    warehouseLocation: productData.warehouseLocation
  };

  products.unshift(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Log initial stock IN
  addStockLog({
    productId: newProduct.id,
    productName: newProduct.name,
    sku: newProduct.sku,
    quantityChanged: newProduct.currentStock,
    movementType: 'IN',
    reason: 'Initial Product Stock Inward',
    createdBy: currentUser.name
  });

  return newProduct;
}

export function adjustStock(productId: string, quantity: number, type: 'IN' | 'OUT', reason: string): { success: boolean; message: string; product?: Product } {
  const products = getProducts();
  const currentUser = getCurrentUser();
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) return { success: false, message: 'Product not found' };

  const product = products[index];

  if (type === 'OUT' && product.currentStock < quantity) {
    return {
      success: false,
      message: `Insufficient stock! Product '${product.name}' currently has ${product.currentStock} units, but ${quantity} were requested.`
    };
  }

  const newStock = type === 'IN' ? product.currentStock + quantity : product.currentStock - quantity;
  products[index].currentStock = newStock;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Log movement
  addStockLog({
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    quantityChanged: quantity,
    movementType: type,
    reason: reason || (type === 'IN' ? 'Manual Restock' : 'Manual Outward'),
    createdBy: currentUser.name
  });

  return { success: true, message: 'Stock updated successfully', product: products[index] };
}

// Stock Logs
export function getStockLogs(): StockLog[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.STOCK_LOGS);
  return raw ? JSON.parse(raw) : [];
}

function addStockLog(logData: { productId: string; productName: string; sku: string; quantityChanged: number; movementType: 'IN' | 'OUT'; reason: string; createdBy: string }) {
  const logs = getStockLogs();
  const newLog: StockLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    ...logData,
    timestamp: new Date().toLocaleString()
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.STOCK_LOGS, JSON.stringify(logs));
}

// Sales Challans
export function getChallans(): Challan[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CHALLANS);
  return raw ? JSON.parse(raw) : [];
}

export function generateChallanNumber(): string {
  const challans = getChallans();
  const count = challans.length + 1;
  return `CHN-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
}

export function createOrUpdateChallan(challanData: {
  id?: string;
  customerId: string;
  items: { productId: string; quantity: number }[];
  status: 'Draft' | 'Confirmed';
  notes?: string;
}): { success: boolean; message: string; challan?: Challan } {
  const customers = getCustomers();
  const products = getProducts();
  const challans = getChallans();
  const currentUser = getCurrentUser();

  const customer = customers.find(c => c.id === challanData.customerId);
  if (!customer) return { success: false, message: 'Customer not found' };

  if (!challanData.items || challanData.items.length === 0) {
    return { success: false, message: 'At least one product item is required' };
  }

  // Validate products & stock if attempting to confirm directly
  const compiledItems = [];
  let totalQty = 0;
  let totalAmt = 0;

  for (const item of challanData.items) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      return { success: false, message: `Product ID ${item.productId} not found` };
    }

    if (item.quantity <= 0) {
      return { success: false, message: `Quantity for '${prod.name}' must be greater than zero` };
    }

    // Crucial Business Requirement: Stock validation on confirmation!
    if (challanData.status === 'Confirmed' && prod.currentStock < item.quantity) {
      return {
        success: false,
        message: `Insufficient stock for product '${prod.name}' (SKU: ${prod.sku}). Available stock: ${prod.currentStock}, Requested: ${item.quantity}`
      };
    }

    const itemTotal = prod.unitPrice * item.quantity;
    totalQty += item.quantity;
    totalAmt += itemTotal;

    // Snapshot data stored in challan
    compiledItems.push({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      unitPrice: prod.unitPrice,
      quantity: item.quantity,
      total: itemTotal
    });
  }

  let targetChallan: Challan;

  if (challanData.id) {
    const existingIndex = challans.findIndex(ch => ch.id === challanData.id);
    if (existingIndex !== -1) {
      const existing = challans[existingIndex];

      if (existing.status === 'Confirmed') {
        return { success: false, message: 'Confirmed challans cannot be edited' };
      }

      targetChallan = {
        ...existing,
        customerId: customer.id,
        customerName: customer.businessName || customer.name,
        customerMobile: customer.mobile,
        customerAddress: customer.address,
        items: compiledItems,
        totalQuantity: totalQty,
        totalAmount: totalAmt,
        status: challanData.status,
        notes: challanData.notes || existing.notes
      };
      challans[existingIndex] = targetChallan;
    } else {
      return { success: false, message: 'Challan not found for update' };
    }
  } else {
    targetChallan = {
      id: `ch_${Date.now()}`,
      challanNumber: generateChallanNumber(),
      customerId: customer.id,
      customerName: customer.businessName || customer.name,
      customerMobile: customer.mobile,
      customerAddress: customer.address,
      items: compiledItems,
      totalQuantity: totalQty,
      totalAmount: totalAmt,
      status: challanData.status,
      createdBy: currentUser.name,
      createdAt: new Date().toLocaleString(),
      notes: challanData.notes || ''
    };
    challans.unshift(targetChallan);
  }

  // If status is CONFIRMED, perform stock reduction & log movements
  if (challanData.status === 'Confirmed') {
    targetChallan.confirmedAt = new Date().toLocaleString();

    for (const item of compiledItems) {
      const prodIndex = products.findIndex(p => p.id === item.productId);
      if (prodIndex !== -1) {
        products[prodIndex].currentStock -= item.quantity;
        addStockLog({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          quantityChanged: item.quantity,
          movementType: 'OUT',
          reason: `Sales Challan Issued (${targetChallan.challanNumber})`,
          createdBy: currentUser.name
        });
      }
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(challans));
  return { success: true, message: `Challan ${targetChallan.challanNumber} saved as ${challanData.status}`, challan: targetChallan };
}

export function confirmChallan(challanId: string): { success: boolean; message: string; challan?: Challan } {
  const challans = getChallans();
  const target = challans.find(ch => ch.id === challanId);

  if (!target) return { success: false, message: 'Challan not found' };
  if (target.status === 'Confirmed') return { success: false, message: 'Challan is already confirmed' };

  return createOrUpdateChallan({
    id: target.id,
    customerId: target.customerId,
    items: target.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    status: 'Confirmed',
    notes: target.notes
  });
}

// Reset Storage to Fresh Demo State
export function resetStorage() {
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.STOCK_LOGS, JSON.stringify(INITIAL_STOCK_LOGS));
  localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(INITIAL_CHALLANS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS.Admin));
  window.location.reload();
}

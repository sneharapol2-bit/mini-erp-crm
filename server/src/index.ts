import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-placement-drive';

app.use(cors());
app.use(express.json());

// In-Memory Database Store for Node.js REST API
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  warehouseLocation: string;
}

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  type: 'Retail' | 'Wholesale' | 'Distributor';
  address: string;
  status: 'Lead' | 'Active' | 'Inactive';
  followUpDate: string;
  notes: string;
}

interface ChallanItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  items: ChallanItem[];
  totalQuantity: number;
  totalAmount: number;
  status: 'Draft' | 'Confirmed' | 'Cancelled';
  createdBy: string;
  createdAt: string;
}

let products: Product[] = [
  { id: 'prod_1', name: 'Industrial Microcontroller Unit (MCU v4)', sku: 'MCU-IND-V4', category: 'Electronics', unitPrice: 1450, currentStock: 120, minStockAlert: 25, warehouseLocation: 'Rack A-12' },
  { id: 'prod_2', name: 'Heavy Duty Power Supply 500W', sku: 'PSU-HD-500W', category: 'Power', unitPrice: 3200, currentStock: 18, minStockAlert: 20, warehouseLocation: 'Rack B-04' }
];

let customers: Customer[] = [
  { id: 'cust_1', name: 'Apex Wholesale Traders', mobile: '+91 98765 43210', email: 'contact@apex.com', businessName: 'Apex Enterprises', gstNumber: '27AAACA123411Z5', type: 'Wholesale', address: 'Gurugram HR', status: 'Active', followUpDate: '2026-07-25', notes: 'Bulk buyer' }
];

let challans: Challan[] = [];

// Middleware: Verify JWT Token
const authenticateJWT = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
  }
};

// Health & API Index
app.get(['/', '/api'], (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Mini ERP + CRM Operations Portal API',
    version: '1.0.0',
    documentation: 'See README.md or use the built-in REST API Tester in the web app',
    endpoints: {
      auth: 'POST /api/auth/login',
      customers: 'GET /api/customers, POST /api/customers',
      products: 'GET /api/products, POST /api/products',
      challans: 'GET /api/challans, POST /api/challans, POST /api/challans/:id/confirm'
    }
  });
});

// 1. Auth Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '24h' });
  return res.json({
    message: 'Authentication successful',
    token,
    user: { email, role }
  });
});

// 2. Customers CRM APIs
app.get('/api/customers', (req: Request, res: Response) => {
  const { search, type, status, page = 1, limit = 10 } = req.query;

  let result = [...customers];
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.businessName.toLowerCase().includes(q));
  }
  if (type && type !== 'ALL') {
    result = result.filter(c => c.type === type);
  }
  if (status && status !== 'ALL') {
    result = result.filter(c => c.status === status);
  }

  return res.json({
    total: result.length,
    page: Number(page),
    limit: Number(limit),
    data: result
  });
});

app.post('/api/customers', (req: Request, res: Response) => {
  const { name, mobile, email, businessName, type, address, status, notes } = req.body;
  if (!name || !mobile || !businessName) {
    return res.status(400).json({ error: 'Validation Error: name, mobile, and businessName are required' });
  }

  const newCustomer: Customer = {
    id: `cust_${Date.now()}`,
    name,
    mobile,
    email,
    businessName,
    type: type || 'Wholesale',
    address: address || '',
    status: status || 'Lead',
    followUpDate: new Date().toISOString().split('T')[0],
    notes: notes || ''
  };

  customers.unshift(newCustomer);
  return res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
});

// 3. Products & Stock Inventory APIs
app.get('/api/products', (req: Request, res: Response) => {
  return res.json({ total: products.length, data: products });
});

app.post('/api/products', (req: Request, res: Response) => {
  const { name, sku, category, unitPrice, currentStock, minStockAlert, warehouseLocation } = req.body;
  if (!name || !sku || unitPrice === undefined || currentStock === undefined) {
    return res.status(400).json({ error: 'Validation Error: name, sku, unitPrice, and currentStock are required' });
  }

  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name,
    sku: sku.toUpperCase(),
    category: category || 'General',
    unitPrice: Number(unitPrice),
    currentStock: Number(currentStock),
    minStockAlert: Number(minStockAlert || 10),
    warehouseLocation: warehouseLocation || 'Main Warehouse'
  };

  products.unshift(newProduct);
  return res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// 4. Sales Challans APIs (With Mandatory Stock Validation & Reduction Logic!)
app.post('/api/challans', (req: Request, res: Response) => {
  const { customerId, items, status = 'Draft', createdBy = 'Sales User' } = req.body;

  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'At least one item is required' });
  }

  const compiledItems: ChallanItem[] = [];
  let totalQuantity = 0;
  let totalAmount = 0;

  // Validate stock levels before confirmation
  for (const item of items) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      return res.status(404).json({ error: `Product ID '${item.productId}' not found` });
    }

    if (status === 'Confirmed' && prod.currentStock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient Stock Error: Product '${prod.name}' has only ${prod.currentStock} units in stock, but ${item.quantity} units were requested.`
      });
    }

    const itemTotal = prod.unitPrice * item.quantity;
    totalQuantity += item.quantity;
    totalAmount += itemTotal;

    compiledItems.push({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      unitPrice: prod.unitPrice,
      quantity: item.quantity,
      total: itemTotal
    });
  }

  // Deduct stock if status is confirmed
  if (status === 'Confirmed') {
    for (const item of compiledItems) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.currentStock -= item.quantity;
      }
    }
  }

  const newChallan: Challan = {
    id: `ch_${Date.now()}`,
    challanNumber: `CHN-2026-${String(challans.length + 1).padStart(3, '0')}`,
    customerId: customer.id,
    customerName: customer.businessName,
    items: compiledItems,
    totalQuantity,
    totalAmount,
    status,
    createdBy,
    createdAt: new Date().toISOString()
  };

  challans.unshift(newChallan);
  return res.status(201).json({ message: `Challan generated as ${status}`, challan: newChallan });
});

app.get('/api/challans', (req: Request, res: Response) => {
  return res.json({ total: challans.length, data: challans });
});

app.listen(PORT, () => {
  console.log(`🚀 Mini ERP + CRM Backend API running on port ${PORT}`);
});

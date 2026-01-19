
import os
import sys
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Ensure we can import shared_data if needed
sys.path.append(os.path.dirname(__file__))

random.seed(42)
np.random.seed(42)

def get_random_date(start_year, end_year):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_vendors():
    vendors = [
        {'vendor_id': 'VEN001', 'name': 'McKesson Corporation', 'type': 'Pharmaceutical', 'lead_time_days': 2, 'contract_status': 'Active'},
        {'vendor_id': 'VEN002', 'name': 'Cardinal Health', 'type': 'Pharmaceutical', 'lead_time_days': 3, 'contract_status': 'Active'},
        {'vendor_id': 'VEN003', 'name': 'AmerisourceBergen', 'type': 'Pharmaceutical', 'lead_time_days': 2, 'contract_status': 'Active'},
        {'vendor_id': 'VEN004', 'name': 'Medline Industries', 'type': 'MedSurg', 'lead_time_days': 5, 'contract_status': 'Active'},
        {'vendor_id': 'VEN005', 'name': 'Henry Schein', 'type': 'MedSurg', 'lead_time_days': 4, 'contract_status': 'Active'},
        {'vendor_id': 'VEN006', 'name': 'Owens & Minor', 'type': 'Logistics', 'lead_time_days': 3, 'contract_status': 'Active'},
        {'vendor_id': 'VEN007', 'name': 'Stryker', 'type': 'Equipment', 'lead_time_days': 10, 'contract_status': 'Review'},
        {'vendor_id': 'VEN008', 'name': 'Baxter International', 'type': 'Medical Devices', 'lead_time_days': 7, 'contract_status': 'Active'},
        {'vendor_id': 'VEN009', 'name': 'Cintas', 'type': 'Hotel Services', 'lead_time_days': 3, 'contract_status': 'Active'},
        {'vendor_id': 'VEN010', 'name': 'US Foods', 'type': 'Food Services', 'lead_time_days': 2, 'contract_status': 'Active'}
    ]
    return pd.DataFrame(vendors)

def enrich_pharmacy_inventory(inventory_df, vendors_df):
    """Add supply chain columns to pharmacy inventory"""
    
    pharma_vendors = vendors_df[vendors_df['type'] == 'Pharmaceutical']['vendor_id'].tolist()
    
    enriched_data = []
    
    for idx, row in inventory_df.iterrows():
        # Cost simulation
        if any(x in row['drug_name'] for x in ['Mab', 'Nib', 'Vir']): # Biologics/antivirals expensive
            cost = random.uniform(500.0, 5000.0)
        else:
            cost = random.uniform(0.5, 50.0)
            
        # Inventory logic
        stock = row['stock_level']
        par_level = int(stock * random.uniform(1.2, 2.5)) # Target stock is usually higher than current
        reorder_point = int(par_level * 0.3)
        min_order_qty = int(par_level * 0.2)
        
        # Status
        if stock == 0:
            status = 'Stockout'
        elif stock < reorder_point:
            status = 'Critical Low'
        elif stock < par_level * 0.5:
            status = 'Low'
        elif stock > par_level * 1.5:
            status = 'Overstock'
        else:
            status = 'OK'
            
        row['par_level'] = par_level
        row['reorder_point'] = reorder_point
        row['min_order_qty'] = min_order_qty
        row['cost_per_unit'] = round(cost, 2)
        row['supplier_id'] = random.choice(pharma_vendors)
        row['last_restock_date'] = (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
        row['inventory_status'] = status
        
        enriched_data.append(row)
        
    return pd.DataFrame(enriched_data)

def generate_general_inventory(vendors_df):
    items = [
        # PPE
        ('PPE', 'N95 Respirator', 'Box of 20'),
        ('PPE', 'Surgical Mask', 'Box of 50'),
        ('PPE', 'Isolation Gown', 'Case of 100'),
        ('PPE', 'Exam Gloves S', 'Box of 100'),
        ('PPE', 'Exam Gloves M', 'Box of 100'),
        ('PPE', 'Exam Gloves L', 'Box of 100'),
        ('PPE', 'Face Shield', 'Box of 50'),
        
        # MedSurg
        ('MedSurg', 'IV Tubing Primary', 'Case of 50'),
        ('MedSurg', 'IV Tubing Secondary', 'Case of 50'),
        ('MedSurg', 'Syringe 3ml', 'Box of 100'),
        ('MedSurg', 'Syringe 5ml', 'Box of 100'),
        ('MedSurg', 'Syringe 10ml', 'Box of 100'),
        ('MedSurg', 'Needle 20G', 'Box of 100'),
        ('MedSurg', 'Needle 22G', 'Box of 100'),
        ('MedSurg', 'Alcohol Prep Pads', 'Box of 200'),
        ('MedSurg', 'Gauze 4x4', 'Pack of 50'),
        ('MedSurg', 'Saline Flush', 'Box of 100'),
        
        # Bed/Hotel
        ('Hotel', 'Fitted Sheet', 'Each'),
        ('Hotel', 'Flat Sheet', 'Each'),
        ('Hotel', 'Pillow Case', 'Each'),
        ('Hotel', 'Patient Blanket', 'Each'),
        ('Hotel', 'Towel Set', 'Each'),
        ('Hotel', 'Chux Pads', 'Case of 50'),
        
        # Lab
        ('Lab', 'Vacutainer Red', 'Tray of 100'),
        ('Lab', 'Vacutainer Lavender', 'Tray of 100'),
        ('Lab', 'Vacutainer Blue', 'Tray of 100'),
        ('Lab', 'Urine Cup', 'Bag of 50'),
        ('Lab', 'Biohazard Bag', 'Roll of 100')
    ]
    
    medsurg_vendors = vendors_df[vendors_df['type'].isin(['MedSurg', 'Logistics'])]['vendor_id'].tolist()
    hotel_vendors = vendors_df[vendors_df['type'] == 'Hotel Services']['vendor_id'].tolist()
    
    inventory = []
    
    locations = ['Central Supply', 'MedSurg-North-Supply', 'MedSurg-South-Supply', 'ICU-Supply', 'ED-Supply', 'OR-Supply']
    
    for category, name, unit in items:
        # Create item entry for each location
        for loc in locations:
            # Skip some items for specific locations
            if category == 'Hotel' and 'OR' in loc: continue
            
            item_id = f"G{len(inventory)+1:06d}"
            
            # Inventory logic
            par_level = random.randint(20, 500)
            stock = int(par_level * random.uniform(0.1, 1.2)) # Random stock status
            
            # Create some critical shortages
            if random.random() < 0.1:
                stock = int(par_level * 0.1) # 10% of par -> Critical
            
            reorder_point = int(par_level * 0.4)
            min_order_qty = int(par_level * 0.5)
            cost = random.uniform(1.0, 150.0)
            
            vendor_pool = hotel_vendors if category == 'Hotel' else medsurg_vendors
            
            # Status
            if stock == 0: status = 'Stockout'
            elif stock < reorder_point: status = 'Critical Low'
            elif stock < par_level * 0.6: status = 'Low'
            else: status = 'OK'
            
            item = {
                'item_id': item_id,
                'name': name,
                'category': category,
                'unit': unit,
                'location': loc,
                'stock_level': stock,
                'par_level': par_level,
                'reorder_point': reorder_point,
                'min_order_qty': min_order_qty,
                'unit_cost': round(cost, 2),
                'vendor_id': random.choice(vendor_pool),
                'status': status,
                'last_restock_date': (datetime.now() - timedelta(days=random.randint(1, 60))).strftime('%Y-%m-%d')
            }
            inventory.append(item)
            
    return pd.DataFrame(inventory)

def generate_purchase_orders(inventory_df, vendors_df):
    """Generate purchase orders from supply chain history"""
    pos = []
    
    for i in range(200):
        po_id = f"PO{20250001 + i}"
        vendor = vendors_df.sample(1).iloc[0]
        
        # Date logic
        order_date = datetime.now() - timedelta(days=random.randint(1, 365))
        
        # Status
        if (datetime.now() - order_date).days > 14:
            status = 'Closed'
        elif (datetime.now() - order_date).days > 7:
            status = 'Received'
        else:
            status = random.choice(['Ordered', 'In Transit', 'Backordered'])
            
        # Items logic - pick items supplied by this vendor
        # (Simplified: just pick random items for now to mock structure)
        num_items = random.randint(1, 10)
        total_cost = random.uniform(500, 50000)
        
        po = {
            'po_id': po_id,
            'vendor_id': vendor['vendor_id'],
            'order_date': order_date.strftime('%Y-%m-%d'),
            'expected_delivery': (order_date + timedelta(days=int(vendor['lead_time_days']))).strftime('%Y-%m-%d'),
            'status': status,
            'item_count': num_items,
            'total_cost': round(total_cost, 2),
            'requested_by': f"STAFF{random.randint(1000,9999)}"
        }
        pos.append(po)
        
    return pd.DataFrame(pos)

def main():
    print("Upgrading Inventory System...")
    
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    meds_dir = os.path.join(base_dir, 'Medications')
    supply_dir = os.path.join(base_dir, 'Supply_Chain')
    
    if not os.path.exists(supply_dir):
        os.makedirs(supply_dir)
        print(f"Created directory: {supply_dir}")
        
    # 1. Generate Vendors
    print("1. Generating Vendors...")
    vendors_df = generate_vendors()
    vendors_df.to_csv(os.path.join(supply_dir, 'vendors.csv'), index=False)
    print(f"   ✓ Created {len(vendors_df)} vendors")
    
    # 2. Upgrade Pharmacy Inventory
    print("2. Upgrading Pharmacy Inventory...")
    inventory_path = os.path.join(meds_dir, 'pharmacy_inventory.csv')
    if os.path.exists(inventory_path):
        inv_df = pd.read_csv(inventory_path)
        enriched_inv_df = enrich_pharmacy_inventory(inv_df, vendors_df)
        enriched_inv_df.to_csv(inventory_path, index=False)
        print(f"   ✓ Upgraded {len(enriched_inv_df)} items with Par levels & Costs")
    else:
        print("   X Pharmacy inventory file not found!")
        
    # 3. Generate General Inventory
    print("3. Generating Hospital Supplies...")
    gen_inv_df = generate_general_inventory(vendors_df)
    gen_inv_df.to_csv(os.path.join(supply_dir, 'general_inventory.csv'), index=False)
    print(f"   ✓ Created {len(gen_inv_df)} general supply items")
    
    # 4. Generate Purchase Orders
    print("4. Generating Purchase Orders...")
    po_df = generate_purchase_orders(gen_inv_df, vendors_df)
    po_df.to_csv(os.path.join(supply_dir, 'purchase_orders.csv'), index=False)
    print(f"   ✓ Created {len(po_df)} purchase orders")
    
    print("\nUpgrade Complete!")

if __name__ == "__main__":
    main()

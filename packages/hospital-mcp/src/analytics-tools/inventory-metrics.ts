
import {
    loadPharmacyInventory,
    loadGeneralInventory,
    loadVendors,
    loadPurchaseOrders
} from "../analytics/data-loader.js";

/**
 * Inventory Dashboard Summary
 */
interface InventoryDashboard {
    overall_status: "OK" | "Warning" | "Critical";
    total_inventory_value: number;
    pharmacy_stats: {
        total_items: number;
        critical_low_items: number;
        stockouts: number;
        expired_items: number;
        value: number;
    };
    supply_chain_stats: {
        total_items: number;
        critical_low_items: number;
        stockouts: number;
        value: number;
    };
    critical_shortages: Array<{
        id: string;
        name: string;
        type: "Pharmacy" | "Supply";
        current_stock: number;
        par_level: number;
        location: string;
        vendor: string;
    }>;
    recent_orders: Array<{
        po_id: string;
        vendor: string;
        status: string;
        delivery_date: string;
    }>;
}

/**
 * Generate comprehensive inventory dashboard
 */
export async function getInventoryDashboard(): Promise<InventoryDashboard> {
    const [pharma, supplies, vendors, orders] = await Promise.all([
        loadPharmacyInventory(),
        loadGeneralInventory(),
        loadVendors(),
        loadPurchaseOrders()
    ]);

    const vendorMap = new Map(vendors.map((v: any) => [v.vendor_id, v.name]));

    // 1. Process Pharmacy
    let pharmValue = 0;
    let pharmCritical = 0;
    let pharmStockouts = 0;
    let pharmExpired = 0;
    const criticalItems: InventoryDashboard["critical_shortages"] = [];

    const today = new Date();

    pharma.forEach((item: any) => {
        const stock = parseInt(item.stock_level);
        const par = parseInt(item.par_level) || 100; // Fallback if old data
        const cost = parseFloat(item.cost_per_unit) || 0;
        const expiry = new Date(item.expiry_date);

        pharmValue += stock * cost;

        if (stock === 0) pharmStockouts++;
        if (stock < parseInt(item.reorder_point || 0)) {
            pharmCritical++;
            if (criticalItems.length < 20) { // Limit detailed list
                criticalItems.push({
                    id: item.inventory_id,
                    name: item.drug_name,
                    type: "Pharmacy",
                    current_stock: stock,
                    par_level: par,
                    location: item.location,
                    vendor: vendorMap.get(item.supplier_id) || "Unknown"
                });
            }
        }
        if (expiry < today) pharmExpired++;
    });

    // 2. Process General Supplies
    let supplyValue = 0;
    let supplyCritical = 0;
    let supplyStockouts = 0;

    supplies.forEach((item: any) => {
        const stock = parseInt(item.stock_level);
        const par = parseInt(item.par_level);
        const cost = parseFloat(item.unit_cost);

        supplyValue += stock * cost;

        if (stock === 0) supplyStockouts++;
        if (stock < parseInt(item.reorder_point)) {
            supplyCritical++;
            if (criticalItems.length < 30) {
                criticalItems.push({
                    id: item.item_id,
                    name: item.name,
                    type: "Supply",
                    current_stock: stock,
                    par_level: par,
                    location: item.location,
                    vendor: vendorMap.get(item.vendor_id) || "Unknown"
                });
            }
        }
    });

    // 3. Process Recent Orders
    const recentParams = orders
        .filter((o: any) => o.status !== "Closed")
        .sort((a: any, b: any) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
        .slice(0, 5)
        .map((o: any) => ({
            po_id: o.po_id,
            vendor: vendorMap.get(o.vendor_id) || "Unknown",
            status: o.status,
            delivery_date: o.expected_delivery
        }));

    // Overall Status Logic
    let status: "OK" | "Warning" | "Critical" = "OK";
    if (pharmStockouts > 0 || supplyStockouts > 5) status = "Critical";
    else if (pharmCritical > 10 || supplyCritical > 20) status = "Warning";

    return {
        overall_status: status,
        total_inventory_value: Math.round(pharmValue + supplyValue),
        pharmacy_stats: {
            total_items: pharma.length,
            critical_low_items: pharmCritical,
            stockouts: pharmStockouts,
            expired_items: pharmExpired,
            value: Math.round(pharmValue)
        },
        supply_chain_stats: {
            total_items: supplies.length,
            critical_low_items: supplyCritical,
            stockouts: supplyStockouts,
            value: Math.round(supplyValue)
        },
        critical_shortages: criticalItems,
        recent_orders: recentParams
    };
}

/**
 * Filter items by vendor or type
 */
export async function searchVendorCatalog(vendorType?: string): Promise<any[]> {
    const vendors = await loadVendors();
    if (!vendorType) return vendors;
    return vendors.filter((v: any) => v.type.toLowerCase().includes(vendorType.toLowerCase()));
}

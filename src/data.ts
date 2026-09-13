import type { Category, OrderStatus, Region, Transaction } from "./types";
const REGIONS: Region[] = ["North", "South", "East", "West"];
const CATEGORIES: Category[] = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];
function mulberry32(seed:number){ return function(){ let t=(seed+=0x6d2b79f5); t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
export function generateTransactions(count:number):Transaction[]{
  const rand=mulberry32(42), start=new Date("2025-01-01T00:00:00Z").getTime(), end=new Date("2026-08-31T23:59:59Z").getTime();
  const rows=new Array<Transaction>(count);
  for(let i=0;i<count;i++){
    const timestamp=Math.floor(start+rand()*(end-start)); const date=new Date(timestamp).toISOString().slice(0,10); const quantity=1+Math.floor(rand()*5);
    const category=CATEGORIES[Math.floor(rand()*CATEGORIES.length)];
    const base=category==="Electronics"?4500:category==="Home"?1800:category==="Fashion"?1200:category==="Beauty"?800:1500;
    const unitPrice=Math.round(base*(0.55+rand()*1.45)); const r=rand(); const status:OrderStatus=r<0.72?"Delivered":r<0.84?"Shipped":r<0.94?"Processing":"Cancelled";
    rows[i]={id:i+1,orderId:`ORD-${String(i+1).padStart(7,"0")}`,customerId:`CUST-${String(1+Math.floor(rand()*Math.max(5000,count/3))).padStart(6,"0")}`,date,timestamp,region:REGIONS[Math.floor(rand()*REGIONS.length)],category,status,quantity,unitPrice,revenue:status==="Cancelled"?0:quantity*unitPrice};
  }
  return rows;
}

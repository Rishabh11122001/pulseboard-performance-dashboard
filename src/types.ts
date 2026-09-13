export type Region = "North" | "South" | "East" | "West";
export type Category = "Electronics" | "Fashion" | "Home" | "Beauty" | "Sports";
export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";
export interface Transaction { id:number; orderId:string; customerId:string; date:string; timestamp:number; region:Region; category:Category; status:OrderStatus; quantity:number; unitPrice:number; revenue:number; }
export interface Filters { region:"All"|Region; category:"All"|Category; status:"All"|OrderStatus; search:string; }
export interface KPI { revenue:number; orders:number; customers:number; aov:number; }

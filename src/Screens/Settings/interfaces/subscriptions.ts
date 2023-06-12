import { premium_type } from "trender-client/Managers/Interfaces/Global";

export type subscriptionInterval = "year" | "month";

export interface Isubscription {
    stripe_product_id: string,
    stripe_price_id: string,
    currency: "usd",
    price: number,
    interval: subscriptionInterval,
    premium_type: premium_type,
    subscription_id: string,
    created_at: string,
    active: boolean
}
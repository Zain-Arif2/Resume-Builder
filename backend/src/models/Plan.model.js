import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true },

    // Price shown to the user, in whole US dollars (e.g. 9 = $9.00)
    priceUSD: { type: Number, required: true, min: 0 },

    // "subscription" = recurring Pro plan (unlimited generations)
    // "one_time"     = one-off credit pack (adds `credits` to the user's balance)
    type: { type: String, enum: ["subscription", "one_time"], required: true },

    // Only relevant for type "one_time" — how many resume credits this purchase grants
    credits: { type: Number, default: null },

    // Only relevant for type "subscription"
    interval: { type: String, enum: ["month", "year", null], default: null },

    stripePriceId: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);

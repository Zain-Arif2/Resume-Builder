import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    provider: { type: String, default: "stripe" },
    stripeSessionId: { type: String, trim: true },
    stripeCustomerId: { type: String, trim: true },
    stripeSubscriptionId: { type: String, trim: true },
    amountUSD: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    creditsGranted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);

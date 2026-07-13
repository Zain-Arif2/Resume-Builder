import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { Plan } from "../src/models/Plan.model.js";

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected. Seeding plans...");

  const plans = [
    {
      name: "Pro Monthly",
      slug: "pro-monthly",
      description: "Unlimited AI resume generations, premium templates, and priority features.",
      priceUSD: 9,
      type: "subscription",
      interval: "month",
      credits: null,
      sortOrder: 1,
    },
    {
      name: "10 Credit Pack",
      slug: "credits-10",
      description: "10 additional AI resume generations, no expiry.",
      priceUSD: 5,
      type: "one_time",
      credits: 10,
      sortOrder: 2,
    },
    {
      name: "50 Credit Pack",
      slug: "credits-50",
      description: "50 additional AI resume generations, best value.",
      priceUSD: 15,
      type: "one_time",
      credits: 50,
      sortOrder: 3,
    },
  ];

  for (const planData of plans) {
    await Plan.findOneAndUpdate({ slug: planData.slug }, planData, { upsert: true, new: true });
    console.log(`Upserted plan: ${planData.slug}`);
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

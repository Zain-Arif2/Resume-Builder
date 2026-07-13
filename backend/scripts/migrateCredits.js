import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { User } from "../src/models/User.model.js";

async function migrate() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB. Starting migration...");

  const creditsResult = await User.updateMany(
    { resumeCredits: { $exists: false } },
    { $set: { resumeCredits: 2 } }
  );
  console.log(`resumeCredits backfilled for ${creditsResult.modifiedCount} users`);

  const planResult = await User.updateMany(
    { plan: { $exists: false } },
    { $set: { plan: "free" } }
  );
  console.log(`plan backfilled for ${planResult.modifiedCount} users`);

  const totalGenResult = await User.updateMany(
    { totalResumeGenerated: { $exists: false } },
    { $set: { totalResumeGenerated: 0 } }
  );
  console.log(`totalResumeGenerated backfilled for ${totalGenResult.modifiedCount} users`);

  const statusResult = await User.updateMany(
    { subscriptionStatus: { $exists: false } },
    { $set: { subscriptionStatus: "inactive" } }
  );
  console.log(`subscriptionStatus backfilled for ${statusResult.modifiedCount} users`);

  console.log("Migration complete.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

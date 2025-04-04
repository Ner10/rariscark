import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./server/db";
import { users } from "./shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  console.log("Creating new admin user...");
  try {
    // Hash the password
    const password = "Sb5RT|1d3REe";
    const hashedPassword = await hashPassword(password);
    
    // Insert the new admin user
    const [newAdmin] = await db.insert(users).values({
      username: "superadmin",
      password: hashedPassword,
      isAdmin: true
    }).returning();
    
    console.log("Admin user created successfully:", newAdmin.username);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Run the function
createAdminUser().then(() => process.exit());
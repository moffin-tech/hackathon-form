import bcrypt from "bcryptjs";
import { getDatabase } from "../lib/mongodb";

async function createSampleUsers() {
  try {
    const db = await getDatabase();

    // Create a customer success user
    const customerSuccessUser = {
      email: "customer.success@moffin.com",
      name: "Customer Success Team",
      password: await bcrypt.hash("password123", 10),
      role: "customer_success",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create a sample client user
    const clientUser = {
      email: "cliente@empresa.com",
      name: "Cliente Empresa",
      password: await bcrypt.hash("password123", 10),
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if users already exist
    const existingCS = await db
      .collection("users")
      .findOne({ email: customerSuccessUser.email });
    const existingClient = await db
      .collection("users")
      .findOne({ email: clientUser.email });

    if (!existingCS) {
      await db.collection("users").insertOne(customerSuccessUser);
      console.log(
        "✅ Customer Success user created:",
        customerSuccessUser.email
      );
    } else {
      console.log(
        "ℹ️ Customer Success user already exists:",
        customerSuccessUser.email
      );
    }

    if (!existingClient) {
      await db.collection("users").insertOne(clientUser);
      console.log("✅ Client user created:", clientUser.email);
    } else {
      console.log("ℹ️ Client user already exists:", clientUser.email);
    }

    console.log("\n📋 Login credentials:");
    console.log("Customer Success: customer.success@moffin.com / password123");
    console.log("Client: cliente@empresa.com / password123");
    console.log("\n🔐 To test impersonation:");
    console.log("1. Login with customer.success@moffin.com");
    console.log(
      '2. In the "Iniciar sesión como" field, enter cliente@empresa.com'
    );
    console.log("3. Submit the form");
  } catch (error) {
    console.error("Error creating sample users:", error);
  }
}

// Run the script
createSampleUsers()
  .then(() => {
    console.log("✅ Sample users setup complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

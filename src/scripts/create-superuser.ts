import readline from "readline";
import User from "@/models/user.model";
import connectDB from "@/configs/db.config";
import { UserGender } from "@/types/user.types";
import { createUser } from "@/services/user.service";

/**
 * Parse CLI args like:
 * --email test@example.com --username admin --password 1234
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const result: Record<string, string> = {};

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--")) {
            const key = args[i].replace(/^--/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            result[key] = args[i + 1];
            i++;
        }
    }
    return result;
}

// 🧠 Ask input helper
function ask(question: string, mask = false): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        if (!mask) {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        } else {
            const stdin = process.stdin;
            process.stdout.write(question);
            stdin.resume();
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding("utf8");

            let input = "";
            const onData = (char: string) => {
                if (char === "\n" || char === "\r" || char === "\u0004") {
                    process.stdout.write("\n");
                    stdin.setRawMode(false);
                    stdin.removeListener("data", onData);
                    rl.close();
                    resolve(input.trim());
                } else if (char === "\u0003") {
                    process.exit();
                } else if (char === "\u007f") {
                    input = input.slice(0, -1);
                } else {
                    input += char;
                    process.stdout.write("*");
                }
            };
            stdin.on("data", onData);
        }
    });
}

async function createSuperUser() {
    const args = parseArgs();
    await connectDB();

    console.log("\n🧑‍💻 Create Superuser Account");
    console.log("--------------------------------");

    // Use CLI args if provided, else fallback to interactive
    const email = args.email || (await ask("Email: "));
    const username = args.username || (await ask("Username: "));
    const password = args.password || (await ask("Password: "));
    const confirmPassword = args.password ? args.password : await ask("Confirm password: ");
    const firstName = args.firstName || (await ask("First name: "));
    const lastName = args.lastName || (await ask("Last name (optional): "));

    let gender: UserGender;

    if (args.gender) {
        const g = args.gender.toLowerCase();
        if (g === "male") gender = "male";
        else if (g === "female") gender = "female";
        else gender = "other";
    } else {
        console.log("\nGender options:");
        console.log("  1️⃣  male");
        console.log("  2️⃣  female");
        console.log("  3️⃣  other");
        const genderInput = await ask("Select gender (1/2/3): ");
        gender = genderInput === "1" ? "male" : genderInput === "2" ? "female" : "other";
    }

    // Validation
    if (!email || !username || !password || !firstName) {
        console.error("\n❌ Missing required fields.\n");
        process.exit(1);
    }

    if (password.length < 8) {
        console.error("\n❌ Password must be at least 8 characters.\n");
        process.exit(1);
    }

    if (password !== confirmPassword) {
        console.error("\n❌ Passwords do not match.\n");
        process.exit(1);
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        console.error("\n❌ A user with this email or username already exists.\n");
        process.exit(1);
    }

    const user = await createUser({
        email,
        username,
        password,
        firstName,
        lastName,
        role: "admin",
        status: "active",
        gender,
        isVerified: true,
        emailVerified: true,
    });

    console.log("\n✅ Superuser created successfully!");
    console.log("--------------------------------");
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`⚧ Gender: ${user.gender}`);
    console.log(`🏷️ Role: ${user.role}`);
    console.log("--------------------------------\n");

    process.exit(0);
}

createSuperUser().catch((err) => {
    console.error("❌ Error creating superuser:", err);
    process.exit(1);
});

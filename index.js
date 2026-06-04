require("dotenv").config();

const mineflayer = require("mineflayer");
const fs = require("fs");

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

// ---------------- BOT ----------------
const bot = mineflayer.createBot({
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME
});

bot.loadPlugin(pathfinder);

// ---------------- OWNER ----------------
const OWNER = "Swiftness_MC";

// ---------------- STATE ----------------
let active = false;

// ---------------- LOAD COMMANDS ----------------
const commands = new Map();

if (fs.existsSync("./commands")) {
    fs.readdirSync("./commands").forEach(file => {
        const cmd = require(`./commands/${file}`);
        commands.set(file.replace(".js", ""), cmd);
    });
}

// ---------------- SPAWN ----------------
bot.once("spawn", () => {
    console.log("✅ HeroxBot v1.21.4 Online");
});

// ---------------- CHAT HANDLER ----------------
bot.on("chat", (username, message) => {

    if (username !== OWNER) return;
    if (username === bot.username) return;

    const args = message.split(" ");
    const raw = args[0];

    // prefix check "."
    if (!raw.startsWith(".")) return;

    const cmd = raw.replace(".", "");

    // ---------------- ACTIVATE BOT ----------------
    if (cmd === "hero") {
        active = true;
        bot.chat("🤖 HeroxBot ACTIVATED (v1.21.4)");
        return;
    }

    // block if not active
    if (!active) return;

    // ---------------- GOTO ----------------
    if (cmd === "goto") {

        const targetName = args[1];

        const player = bot.players[targetName];

        if (!player || !player.entity) {
            bot.chat("❌ Player not found");
            return;
        }

        bot.pathfinder.setGoal(
            new goals.GoalFollow(player.entity, 1),
            true
        );

        bot.chat(`📍 Going to ${targetName}`);
        return;
    }

    // ---------------- FOLLOW ----------------
    if (cmd === "follow") {

        const player = bot.players[OWNER];

        if (!player || !player.entity) return;

        bot.pathfinder.setGoal(
            new goals.GoalFollow(player.entity, 2),
            true
        );

        bot.chat("👣 Following owner");
        return;
    }

    // ---------------- STOP ----------------
    if (cmd === "stop") {
        bot.pathfinder.setGoal(null);
        bot.chat("🛑 Stopped");
        return;
    }

    // ---------------- COME ----------------
    if (cmd === "come") {

        const player = bot.players[OWNER];

        if (!player || !player.entity) return;

        bot.pathfinder.setGoal(
            new goals.GoalNear(
                player.entity.position.x,
                player.entity.position.y,
                player.entity.position.z,
                1
            )
        );

        bot.chat("🚶 Coming");
        return;
    }

    // ---------------- INVENTORY ----------------
    if (cmd === "inventory") {

        const items = bot.inventory.items();

        if (!items.length) {
            bot.chat("📦 Empty inventory");
            return;
        }

        bot.chat(
            items.slice(0, 10)
                .map(i => `${i.name} x${i.count}`)
                .join(", ")
        );

        return;
    }

    // ---------------- CUSTOM COMMANDS ----------------
    if (commands.has(cmd)) {
        commands.get(cmd)(bot, username, args);
    }

});

// ---------------- RECONNECT ----------------
bot.on("end", () => {
    console.log("❌ Disconnected, restarting...");
    setTimeout(() => process.exit(1), 5000);
});

bot.on("error", console.log);

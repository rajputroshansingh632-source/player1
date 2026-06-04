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

// ---------------- OWNER FIXED ----------------
const OWNER = "Swiftness_MC";

// ---------------- STATE ----------------
let active = false;
let followInterval = null;

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
    console.log("✅ HeroxBot Online");

    const mcData = require("minecraft-data")(bot.version);
    bot.pathfinder.setMovements(new Movements(bot, mcData));
});

// ---------------- CHAT HANDLER ----------------
bot.on("chat", (username, message) => {

    if (username !== OWNER) return;
    if (username === bot.username) return;

    const args = message.split(" ");
    const cmd = args[0].replace("/", "");

    // 🔥 ACTIVATE BOT
    if (cmd === "griend") {
        active = true;
        bot.chat("🤖 HeroxBot ACTIVATED!");
        return;
    }

    // ❌ BLOCK IF NOT ACTIVE
    if (!active) return;

    // ---------------- FOLLOW ----------------
    if (cmd === "follow") {

        const player = bot.players[OWNER];

        if (!player || !player.entity) {
            bot.chat("❌ Owner not found");
            return;
        }

        clearInterval(followInterval);

        followInterval = setInterval(() => {
            const target = bot.players[OWNER];

            if (!target || !target.entity) return;

            bot.pathfinder.setGoal(
                new goals.GoalFollow(target.entity, 2),
                true
            );

        }, 1000);

        bot.chat("👣 Following Owner");
        return;
    }

    // ---------------- STOP ----------------
    if (cmd === "stop") {
        clearInterval(followInterval);
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

        bot.chat("🚶 Coming to Owner");
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
            items
                .slice(0, 10)
                .map(i => `${i.name} x${i.count}`)
                .join(", ")
        );

        return;
    }

    // ---------------- COMMANDS FOLDER ----------------
    if (commands.has(cmd)) {
        commands.get(cmd)(bot, username, args);
    }

});

// ---------------- RECONNECT ----------------
bot.on("end", () => {
    console.log("❌ Disconnected, restarting...");

    setTimeout(() => {
        process.exit(1);
    }, 5000);
});

bot.on("error", console.log);

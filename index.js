require("dotenv").config();

const mineflayer = require("mineflayer");
const fs = require("fs");

const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const autoEat = require("./utils/autoeat");
const autoMLG = require("./utils/automlg");
const autoPickup = require("./utils/autopickup");

// ---------------- BOT ----------------
const bot = mineflayer.createBot({
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME
});

bot.loadPlugin(pathfinder);

// ---------------- OWNER ----------------
const OWNER = process.env.OWNER_NAME || "Swiftness_MC";

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

    console.log(`✅ ${bot.username} Online`);

    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);

    bot.pathfinder.setMovements(defaultMove);

    // Utilities
    autoEat(bot);
    autoMLG(bot);
    autoPickup(bot);

});

// ---------------- ALERT ----------------
bot.on("entityHurt", (entity) => {

    if (entity !== bot.entity) return;

    bot.chat("⚠️ Alert: Attack on my system failed.");

});

// ---------------- CHAT HANDLER ----------------
bot.on("chat", (username, message) => {

    if (username === bot.username) return;
    if (username !== OWNER) return;

    const args = message.split(" ");
    const raw = args[0];

    if (!raw.startsWith(".")) return;

    const cmd = raw.slice(1).toLowerCase();

    // Activate
    if (cmd === "hero") {
        active = true;
        bot.chat("🤖 HeroxBot Activated");
        return;
    }

    if (!active) return;

    // Follow Owner
    if (cmd === "follow") {

        const player = bot.players[OWNER];

        if (!player || !player.entity) {
            bot.chat("❌ Owner not found");
            return;
        }

        bot.pathfinder.setGoal(
            new goals.GoalFollow(player.entity, 2),
            true
        );

        bot.chat("👣 Following owner");
        return;
    }

    // Stop
    if (cmd === "stop") {

        bot.pathfinder.setGoal(null);
        bot.clearControlStates();

        bot.chat("🛑 Stopped");
        return;
    }

    // Come
    if (cmd === "come") {

        const player = bot.players[OWNER];

        if (!player || !player.entity) {
            bot.chat("❌ Owner not found");
            return;
        }

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

    // Goto Player
    if (cmd === "goto" && args.length === 2) {

        const player = bot.players[args[1]];

        if (!player || !player.entity) {
            bot.chat("❌ Player not found");
            return;
        }

        bot.pathfinder.setGoal(
            new goals.GoalFollow(player.entity, 1),
            true
        );

        bot.chat(`📍 Going to ${args[1]}`);
        return;
    }

    // Goto Coordinates
    if (cmd === "goto" && args.length === 4) {

        const x = parseInt(args[1]);
        const y = parseInt(args[2]);
        const z = parseInt(args[3]);

        bot.pathfinder.setGoal(
            new goals.GoalNear(x, y, z, 1)
        );

        bot.chat(`📍 Going to ${x} ${y} ${z}`);
        return;
    }

    // Inventory
    if (cmd === "inventory") {

        const items = bot.inventory.items();

        if (!items.length) {
            bot.chat("📦 Inventory empty");
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

    // Custom Commands
    if (commands.has(cmd)) {
        try {
            commands.get(cmd)(bot, username, args);
        } catch (err) {
            console.log(err);
            bot.chat(`❌ Error in command ${cmd}`);
        }
    }

});

// ---------------- RECONNECT ----------------
bot.on("end", () => {
    console.log("❌ Disconnected");
});

bot.on("error", console.log);

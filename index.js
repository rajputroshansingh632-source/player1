require("dotenv").config();

const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const pvp = require("mineflayer-pvp").plugin;

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
bot.loadPlugin(pvp);

// ---------------- OWNER ----------------
const OWNER = process.env.OWNER_NAME;

// ---------------- STATE ----------------
let active = false;

// ---------------- SPAWN ----------------
bot.once("spawn", () => {

    console.log("✅ Bot Online");

    const mcData = require("minecraft-data")(bot.version);
    const defaultMove = new Movements(bot, mcData);

    bot.pathfinder.setMovements(defaultMove);

    autoEat(bot);
    autoMLG(bot);
    autoPickup(bot);
});

// ---------------- CHAT COMMANDS ----------------
bot.on("chat", (username, message) => {

    if (username !== OWNER) return;

    const args = message.split(" ");
    const cmd = args[0].toLowerCase();

    if (!cmd.startsWith(".")) return;

    const c = cmd.slice(1);

    // activate
    if (c === "hero") {
        active = true;
        bot.chat("🤖 Activated");
        return;
    }

    if (!active) return;

    // stop
    if (c === "stop") {
        bot.pathfinder.setGoal(null);
        bot.pvp.stop();
        bot.clearControlStates();
        bot.chat("🛑 Stopped");
        return;
    }

    // follow owner
    if (c === "follow") {
        const p = bot.players[OWNER];
        if (!p?.entity) return;

        bot.pathfinder.setGoal(
            new goals.GoalFollow(p.entity, 2),
            true
        );
        bot.chat("👣 Following");
        return;
    }

    // come
    if (c === "come") {
        const p = bot.players[OWNER];
        if (!p?.entity) return;

        bot.pathfinder.setGoal(
            new goals.GoalNear(
                p.entity.position.x,
                p.entity.position.y,
                p.entity.position.z,
                1
            )
        );
        bot.chat("🚶 Coming");
        return;
    }
});

// ---------------- DEFENSE SYSTEM ----------------
bot.on("entityHurt", (entity) => {

    if (entity !== bot.entity) return;

    const attacker = Object.values(bot.players).find(p =>
        p.entity &&
        p.username !== OWNER &&
        p.entity.position.distanceTo(bot.entity.position) < 4
    );

    if (!attacker?.entity) {
        bot.chat("⚠️ Attack detected");
        return;
    }

    bot.chat(`⚔️ ${attacker.username} attacked me!`);

    bot.pvp.attack(attacker.entity);
});

// ---------------- RECONNECT ----------------
bot.on("end", () => {
    console.log("❌ Reconnecting...");
    setTimeout(() => process.exit(1), 5000);
});

bot.on("error", console.log);

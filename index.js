require("dotenv").config();

const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const bot = mineflayer.createBot({
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME
});

bot.loadPlugin(pathfinder);

let followMode = false;

bot.once("spawn", () => {
    console.log("✅ HeroxBot Online");

    const mcData = require("minecraft-data")(bot.version);
    bot.pathfinder.setMovements(new Movements(bot, mcData));
});

bot.on("chat", (username, message) => {

    if (username !== process.env.OWNER_NAME) return;
    if (username === bot.username) return;

    const player = bot.players[username];

    // FOLLOW
    if (message === "/follow") {

        if (!player || !player.entity) {
            bot.chat("I can't find you.");
            return;
        }

        followMode = true;

        bot.chat("Following owner.");
    }

    // STOP
    if (message === "/stop") {

        followMode = false;

        bot.pathfinder.setGoal(null);

        bot.chat("Stopped.");
    }

    // COME
    if (message === "/come") {

        if (!player || !player.entity) return;

        bot.pathfinder.setGoal(
            new goals.GoalNear(
                player.entity.position.x,
                player.entity.position.y,
                player.entity.position.z,
                1
            )
        );

        bot.chat("Coming.");
    }

    // INVENTORY
    if (message === "/inventory") {

        const items = bot.inventory.items();

        if (items.length === 0) {
            bot.chat("Inventory is empty.");
            return;
        }

        bot.chat(
            items
                .slice(0, 10)
                .map(i => `${i.name} x${i.count}`)
                .join(", ")
        );
    }
});

setInterval(() => {

    if (!followMode) return;

    const player = bot.players[process.env.OWNER_NAME];

    if (!player || !player.entity) return;

    bot.pathfinder.setGoal(
        new goals.GoalFollow(
            player.entity,
            2
        ),
        true
    );

}, 1000);

bot.on("error", console.log);

bot.on("end", () => {
    console.log("❌ Disconnected");
});

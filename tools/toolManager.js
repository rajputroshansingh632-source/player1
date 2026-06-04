module.exports = {
    
    craftTable(bot) {
        const plank = bot.inventory.items().find(i => i.name.includes("planks"));
        if (!plank) return bot.chat("❌ No wood planks");

        bot.chat("🪵 Crafting crafting table...");
        // simple placeholder (advanced crafting later)
    },

    makeWood(bot) {
        const log = bot.inventory.items().find(i => i.name.includes("log"));
        if (!log) return bot.chat("❌ No wood logs");

        bot.chat("🌲 Turning logs into planks...");
    },

    tools(bot) {
        bot.chat("🔧 Tools system ready:");
        bot.chat("wood, craft, inventory, mine");
    }

};

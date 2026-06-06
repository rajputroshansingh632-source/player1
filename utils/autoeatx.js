bot.on("health", async () => {
    if (bot.food > 14) return;

    const food = bot.inventory.items().find(item =>
        item.name.includes("bread") ||
        item.name.includes("beef") ||
        item.name.includes("chicken")
    );

    if (!food) return;

    try {
        await bot.equip(food, "hand");
        await bot.consume();
        bot.chat("🍖 Eating...");
    } catch {}
});

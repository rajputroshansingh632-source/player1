module.exports = (bot) => {

    const items = bot.inventory.items();

    if (!items.length) {
        bot.chat("Inventory empty.");
        return;
    }

    bot.chat(
        items
            .slice(0, 10)
            .map(i => `${i.name} x${i.count}`)
            .join(", ")
    );
};

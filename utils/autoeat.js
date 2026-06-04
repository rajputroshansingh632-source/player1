module.exports = (bot) => {

    const foodNames = [
        "bread",
        "cooked_beef",
        "cooked_porkchop",
        "apple",
        "cooked_chicken"
    ];

    setInterval(() => {

        if (bot.food < 15) {
            const food = bot.inventory.items().find(i =>
                foodNames.includes(i.name)
            );

            if (food) {
                bot.equip(food, "hand", () => {
                    bot.consume(() => {
                        bot.chat("🍖 Eating food...");
                    });
                });
            }
        }

    }, 5000);

};

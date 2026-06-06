bot.on("physicsTick", async () => {

    const block = bot.blockAt(
        bot.entity.position.offset(0, -1, 0)
    );

    if (!block) return;

    if (block.name === "cobweb") {

        bot.setControlState("jump", true);

        const shears = bot.inventory.items().find(
            item => item.name === "shears"
        );

        if (shears) {
            try {
                await bot.equip(shears, "hand");
            } catch {}
        }
    }
});

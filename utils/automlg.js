module.exports = function(bot) {

    let active = false;

    bot.on("physicsTick", async () => {

        if (active) return;

        // Rough fall detection
        if (bot.entity.velocity.y < -0.8) {

            const bucket = bot.inventory.items().find(
                item => item.name === "water_bucket"
            );

            if (!bucket) return;

            active = true;

            try {

                await bot.equip(bucket, "hand");

                const block = bot.blockAt(
                    bot.entity.position.offset(0, -3, 0)
                );

                if (block) {
                    await bot.placeBlock(
                        block,
                        new (require("vec3"))(0, 1, 0)
                    );
                }

            } catch (e) {}

            setTimeout(() => {
                active = false;
            }, 3000);
        }

    });

};

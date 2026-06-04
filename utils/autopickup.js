module.exports = (bot) => {

    bot.on("physicTick", () => {
        const items = Object.values(bot.entities);

        for (const item of items) {
            if (item.name === "item" && item.position) {
                const dist = bot.entity.position.distanceTo(item.position);

                if (dist < 2.5) {
                    bot.pathfinder.setGoal(
                        new (require("mineflayer-pathfinder").goals.GoalNear)(
                            item.position.x,
                            item.position.y,
                            item.position.z,
                            1
                        )
                    );
                }
            }
        }
    });

};

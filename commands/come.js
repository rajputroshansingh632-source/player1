module.exports = (bot, player) => {
    if (!player || !player.entity) return;

    const { goals } = require("mineflayer-pathfinder");

    bot.pathfinder.setGoal(
        new goals.GoalNear(
            player.entity.position.x,
            player.entity.position.y,
            player.entity.position.z,
            1
        )
    );

    bot.chat("Coming.");
};

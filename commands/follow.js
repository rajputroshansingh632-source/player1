module.exports = (bot, player) => {
    if (!player || !player.entity) return;

    const { goals } = require("mineflayer-pathfinder");

    bot.pathfinder.setGoal(
        new goals.GoalFollow(player.entity, 2),
        true
    );

    bot.chat("Following.");
};

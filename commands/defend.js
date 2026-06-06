let defendInterval = null;

module.exports = (bot) => {

    if (defendInterval) {
        clearInterval(defendInterval);
    }

    bot.chat("🛡️ Defense mode activated.");

    const hostileMobs = [
        "zombie",
        "skeleton",
        "creeper",
        "spider",
        "enderman",
        "witch",
        "drowned",
        "husk",
        "stray"
    ];

    defendInterval = setInterval(() => {

        const owner = bot.players["Swiftness_MC"];

        if (!owner || !owner.entity) return;

        const mob = Object.values(bot.entities).find(entity =>
            hostileMobs.includes(entity.name) &&
            entity.position.distanceTo(owner.entity.position) < 8
        );

        if (!mob) return;

        bot.chat(`⚔️ Defending against ${mob.name}`);

        bot.lookAt(mob.position.offset(0, 1, 0), true);

        if (mob.position.distanceTo(bot.entity.position) < 4) {
            bot.attack(mob);
        }

    }, 1000);

};

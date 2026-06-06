module.exports = (bot) => {

    if (bot.pvp) {
        bot.pvp.stop();
    }

    bot.clearControlStates();

    bot.chat("🛡️ PvP stopped.");

};

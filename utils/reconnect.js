module.exports = (bot) => {

    bot.on("end", () => {
        console.log("❌ Disconnected. Reconnecting in 5s...");

        setTimeout(() => {
            require("../index");
        }, 5000);
    });

};

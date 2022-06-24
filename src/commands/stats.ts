import { Command } from "../typings/";
import { version } from "discord.js";
import moment from "moment";
import "moment-duration-format";
// @ts-expect-error
import cpuStat from "cpu-stat";
import { data as ClusterData } from "discord-hybrid-sharding";

export let command: Command = {
  name: "stats",
  description: "Отправляет информацию о боте",
  category: "Информация",
  options: [],
  emoji: "🤖",
  run: async (interaction, client, f) => {
    let botuptime: string = moment
      .duration(
        <any>await client.cluster.evalOnManager("process.uptime()"),
        "seconds"
      )
      .format(" D[ Д], H[ Ч], m[ М]");

    let guilds = 0;

    await client.cluster
      .broadcastEval(`this.guilds.cache.size`)
      .then(
        (results) => (guilds = results.reduce((prev, val) => prev + val, 0))
      );

    cpuStat.usagePercent((_e: unknown, percent: number, _seconds: unknown) => {
      interaction.reply({
        embeds: [
          new f.embed()
            .setTitle(`📦 | Статистика бота`)
            .addField(
              `Исп. ОЗУ`,
              `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} МБ`,
              true
            )
            .addField(`Исп. Процессора`, `${percent.toFixed(2)}%`, true)
            .addField(`Время работы`, `${botuptime}`, true)
            .addField(`ОС`, "Linux: Ubuntu", true)
            .addField(`Хост`, "Сервер моего друга", true)
            .addField(
              `Запущен с помощью`,
              "[Docker](https://docker.com/)",
              true
            )
            .addField(
              `ЯП`,
              `[Node.js ${process.version}](https://nodejs.org/)`,
              true
            )
            .addField(
              `Библиотека`,
              `[discord.js v${version}](https://discord.js.org/)`,
              true
            )
            .addField(
              `API Кластеризаций`,
              "[discord-hybrid-sharding](https://npmjs.com/package/discord-hybrid-sharding)",
              true
            )
            .addField(`Кластеров`, String(ClusterData.TOTAL_SHARDS), true)
            .addField(`Серверов`, String(guilds), true)
            .setColor(f.colors.default)
            .setFooter({
              text: `С любовью Tiratira#1111`,
              iconURL: client.user!.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    });
  },
};

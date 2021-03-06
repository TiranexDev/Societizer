let answers = [
  "Да",
  "Нет",
  "Возможно",
  "Не знаю",
  "Отвечу потом... Но это не точно",
  "Спроси бобика",
  "Мои 1000-7 гугл запросов говорят... ||Нет||",
  "Мои 1000-7 гугл запросов говорят... ||Да||",
  "Конечно",
  "Нет, нет, нет",
  "Да, просто да",
  "Да но нет но да",
  "Спроси у гугла",
];

import { Command } from "../typings/";

export let command: Command = {
  name: "8ball",
  emoji: "🎱",
  description: "Отвечает на вопрос",
  category: "Развлечения",
  options: [
    {
      name: "вопрос",
      description: "Вопрос",
      type: 3,
      required: true,
    },
  ],
  run: async (interaction, client, f) => {
    let question =
      interaction.options.getString("вопрос", false) || "Что за вопрос?";
    let answer = answers[Math.floor(Math.random() * answers.length)];

    let embed = new f.embed()
      .setTitle(`🎱 | Шар предсказаний`)
      .addFields([
        { name: "Ваш вопрос", value: question, inline: true },
        { name: "Мой ответ", value: answer, inline: true },
      ])
      .setColor(f.colors.default)
      .setFooter({
        text: client.user!.username,
        iconURL: client.user!.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};

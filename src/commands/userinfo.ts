import { Command } from "../typings/";

export const command: Command = {
  name: "userinfo",
  emoji: "🔍",
  category: "Информация",
  description: "Получить информацию о пользователе",
  options: [
    {
      name: "user",
      type: 6,
      description: "Пользователь о котором вы хотите получить информацию",
      autocomplete: false,
      required: false,
    },
  ],
  run: async (interaction, client, f) => {
    let user = interaction.options.getUser("user", false) || interaction.user;

    const userEm = new f.embed()
      .setTitle(
        `🔍 | Информация о ${user.bot || user.system ? "боте" : ""} ${user.tag}`
      )
      .addFields([
        { name: `Ник`, value: `${user.tag}`, inline: true },
        {
          name: `Аккаунт Создан`,
          value: `${formatDate(user.createdAt)}`,
          inline: true,
        },
        {
          name: `Бот`,
          value: user?.bot || user?.system ? `Да` : `Нет`,
          inline: true,
        },
      ])
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(f.colors.default)
      .setTimestamp()
      .setFooter({
        text: client.user!.username,
        iconURL: client.user!.displayAvatarURL(),
      });

    interaction.reply({ embeds: [userEm] });
  },
};

function formatDate(date: Date): string {
  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
}

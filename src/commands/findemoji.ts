import { Message } from 'discord.js'
import { Command } from '../typings'

export let command: Command = {
    name: 'findemoji',
    emoji: '🔍',
    description: 'Ищет эмодзи по названию (с помощью emoji.gg)',
    options: [
        {
            name: 'название',
            description: 'Название эмодзи',
            required: true,
            type: 3,
        },
        {
            name: 'анонимно',
            description: 'Анонимно или нет',
            type: 5,
            required: false,
        },
    ],
    category: 'Утилиты',
    run: async (interaction, client, f) => {
        fetch(`https://emoji.gg/api`).then((res) => {
            res.json().then(async (r) => {
                let Emojis = r.filter((u: { title: string }) =>
                    u.title.includes(
                        interaction.options.getString('название', true)
                    )
                )
                if (Emojis.length == 0)
                    return interaction.reply({
                        embeds: [
                            f.aembed(
                                `Ошибка`,
                                `Не найдено эмодзи с названием "${interaction.options.getString(
                                    'название',
                                    true
                                )}"`,
                                f.colors.error
                            ),
                        ],
                        ephemeral: true,
                    })
                else {
                    await interaction.deferReply({
                        ephemeral:
                            interaction.options.getBoolean('анонимно', false) ||
                            false,
                    })

                    interaction.editReply({
                        embeds: [
                            f.aembed(
                                `🔍 | Результаты поиска`,
                                `Найдено ${Emojis.length} эмодзи`,
                                f.colors.default
                            ),
                        ],
                    })

                    setTimeout(async () => {
                        const next = new f.MessageButton()
                            .setCustomId('next')
                            .setLabel('Следующее эмодзи')
                            .setStyle('PRIMARY')
                        const prev = new f.MessageButton()
                            .setCustomId('prev')
                            .setLabel('Предыдущие эмодзи')
                            .setStyle('PRIMARY')
                        const close = new f.MessageButton()
                            .setCustomId('close')
                            .setLabel('Закрыть')
                            .setStyle('DANGER')

                        let b = 0

                        let m = (await interaction.editReply({
                            embeds: [
                                new f.embed()
                                    .setImage(Emojis[0].image)
                                    .setTitle(`🔗 | Эмодзи: ${Emojis[b].title}`)
                                    .setFooter({
                                        text: `Айди: ${Emojis[0].id}, API: emoji.gg`,
                                        iconURL:
                                            client.user!.displayAvatarURL(),
                                    })
                                    .setTimestamp()
                                    .setColor(f.colors.default),
                            ],
                            components: [
                                new f.MessageActionRow().addComponents([
                                    prev.setDisabled(b == 0),
                                    next.setDisabled(b == Emojis.length - 1),
                                    close,
                                ]),
                            ],
                        })) as Message

                        const collector = m.createMessageComponentCollector({
                            filter: (i) =>
                                i.customId === 'next' ||
                                i.customId === 'prev' ||
                                i.customId === 'close',
                        })

                        collector.on('collect', async (i) => {
                            if (i.user.id != interaction.user.id) return

                            i.deferReply({})
                            i.deleteReply()

                            if (i.customId === 'next') {
                                b++
                                interaction.editReply({
                                    embeds: [
                                        new f.embed()
                                            .setImage(Emojis[b].image)
                                            .setTitle(
                                                `🔗 | Эмодзи: ${Emojis[b].title}`
                                            )
                                            .setFooter({
                                                text: `Айди: ${Emojis[b].id}, API: emoji.gg`,
                                                iconURL:
                                                    client.user!.displayAvatarURL(),
                                            })
                                            .setTimestamp()
                                            .setColor(f.colors.default),
                                    ],
                                    components: [
                                        new f.MessageActionRow().addComponents([
                                            prev.setDisabled(b == 0),
                                            next.setDisabled(
                                                b == Emojis.length - 1
                                            ),
                                            close,
                                        ]),
                                    ],
                                })
                            } else if (i.customId === 'prev') {
                                b--
                                interaction.editReply({
                                    embeds: [
                                        new f.embed()
                                            .setImage(Emojis[b].image)
                                            .setTitle(
                                                `🔗 | Эмодзи: ${Emojis[b].title}`
                                            )
                                            .setFooter({
                                                text: `Айди: ${Emojis[b].id}, API: emoji.gg`,
                                                iconURL:
                                                    client.user!.displayAvatarURL(),
                                            })
                                            .setTimestamp()
                                            .setColor(f.colors.default),
                                    ],
                                    components: [
                                        new f.MessageActionRow().addComponents([
                                            prev.setDisabled(b == 0),
                                            next.setDisabled(
                                                b == Emojis.length - 1
                                            ),
                                            close,
                                        ]),
                                    ],
                                })
                            } else if (i.customId === 'close') {
                                await interaction.deleteReply().catch((e) => {
                                    if (
                                        e.message ==
                                        'Ephemeral responses cannot be deleted.'
                                    )
                                        return interaction.editReply({
                                            embeds: [
                                                f.aembed(
                                                    `Ошибка`,
                                                    `Бот не может удалить анонимные сообщения, вместо этого нажмите на синий текст снизу.`,
                                                    f.colors.error
                                                ),
                                            ],
                                        })
                                    else
                                        return interaction.editReply({
                                            embeds: [
                                                f.aembed(
                                                    `Ошибка`,
                                                    `Не удалось удалить ваше сообщение, причина неизвестна:`,
                                                    f.colors.error
                                                ),
                                            ],
                                        })
                                })
                            }
                        })
                    }, 1750)
                }
            })
        })
    },
}

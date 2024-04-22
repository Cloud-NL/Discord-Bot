
const { Client, MessageActionRow, ApplicationCommandOptionType, StringSelectMenuBuilder, ButtonStyle, GatewayIntentBits, ActivityType, Discord, EmbedBuilder, GuildMember, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, MessageButton, MessageAttachment, ButtonBuilder, Embed, RoleFlagsBitField, ChannelType } = require('discord.js');
const DiscordJS = { Intents } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const json = require("./config.json")
const scheldwoorden = require("./scheldwoorden.json")
const mysql = require("mysql");
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(`${json.token}`);

client.on('ready', () => {
  client.user.setPresence({
    activities: [{ name: `${json.footerText}`, type: ActivityType.Watching }],
    status: 'dnd',
  });
  console.log("Bot is online")
});

client.on("messageCreate", async (message) => {
  if(message.channelId === "1209520900261679185" || message.channelId === "1209520900261679186")
  {
    if(message.author.id != "1210237228236800030")
    {
      message.delete()
    }
  }
})

client.on("messageCreate", async(message) => {
  for(let i = 0; i < scheldwoorden.scheldwoorden.length; i++)
  {
    if(message.content.toLowerCase().includes(scheldwoorden.scheldwoorden[i]))
    {
      if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      {
        const embed = new EmbedBuilder()
        .setTitle("⚠️ · Tegengehouden")
        .setDescription(`Dat mag je niet zeggen! <@${message.author.id}>`)
        .setColor(json.color)
        .setThumbnail(json.icon)
        .setTimestamp()
        .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
        message.channel.send({embeds: [embed]}).then(successEmbed => {
          setTimeout(function() {
            successEmbed.delete()
          }, 10000)
        })
        message.delete()
        message.member.timeout(60 * 5 * 1000)
        if(!message.member.roles.cache.has("1210696143483445329") &! message.member.roles.cache.has("1210696293756698674"))
        {
          setTimeout(function () { 
            message.member.roles.add("1210696143483445329")
           }, 1000)
        } else if(message.member.roles.cache.has("1210696143483445329") &! message.member.roles.cache.has("1210696293756698674"))
        {
          setTimeout(function() {
            message.member.roles.remove("1210696143483445329")
          }, 1000)
          message.member.roles.add("1210696293756698674")
        } else if(message.member.roles.cache.has("1210696293756698674"))
        {
          message.member.ban({reason: "Na 2 warns doorschelden."}).then(ban => {
            const embed = new EmbedBuilder()
            .setTitle("⚠️ · Ban Log")
            .setDescription(`<@${message.author.id}> is verbannen uit de **Zaandam Roleplay**.\n\n**Verbannen Door:**\n<@1210237228236800030>\n\n**Reden:**\nNa 2 warns doorschelden.`)
            .setColor(json.color)
            .setThumbnail(json.icon)
            .setTimestamp()
            .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
            message.guild.channels.cache.get("1210936847891431505").send( { embeds: [embed]} )
          })
        }
      }
    }
  }
})

client.on("guildMemberAdd" , (member) => {
  
  member.roles.add("1209520898667708461");

  const embed = new EmbedBuilder()
  .setTitle("👋 · Welkom")
  .setDescription(`Welkom bij de **Zaandam Roleplay** <@${member.user.id}>.\nZorg ervoor dat je de <#1209520899540123730> goed leest.\nVerifiëren kan in<#1209520899540123731>.\nHoud zeker <#1209520899540123735> goed in de gaten!👀\n__**👤Leden:**__\n__Wij hebben nu **${member.guild.memberCount}** Leden!__`)
  .setColor(json.color)
  .setThumbnail(json.icon)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`}) //, iconURL: json.client.icon
  member.guild.channels.cache.get('1209520899540123729').send( { embeds: [embed] } )
});

client.on('interactionCreate', async(button, guildMember) => {
  if (!button.isButton()) return;
  if (!button.isMessageComponent()) return
  await button.deferUpdate({ephemeral: false}).catch(() => {});
  if (button.customId === "captcha") {
      role = button.guild.roles.fetch('1209520898667708461');
      member = button.member;
      if(role) {
          member2 = button.guild.roles.fetch('1210244891930533981').then(role => member.roles.add(role)).catch(console.error());
      } else {
          button.deferReply({content: "Je bent al geverifieerd", ephemeral: true}) //1210244891930533981 // 1209520898667708461
      }
  }
})


const commands = [
  {
    name: 'playtime',
    description: 'Bekijk playtime van andere speler.',
    options: [
      {
        name: "user",
        description: "Tag een speler",
        type: 6,
        required: true,
      },
    ],
  },
  {
    name: "verifyembed",
    description: "Plaats de verify embed",
  },
  {
    name: "clear",
    description: "Dit is een test command",
    options: [
      {
        name: "nummer",
        description: "Hoeveel berichten wil je verwijderen?",
        type: ApplicationCommandOptionType.Number,
        required: true,
      }
    ]
  },
  {
    name: "botreload",
    description: "Reload bot"
  },
  {
    name: "regelsembed",
    description: "Maak embed om regels te maken"
  },
  {
    name: "suggestie",
    description: "Maak een suggestie om de server te verbeteren.",
    options: [
      {
        name: "suggestie",
        description: "Vul hier je suggestie in.",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  {
    name: "voertuigsuggestie",
    description: "Maak een voertuig suggestie om de server te verbeteren.",
    options: [
      {
        name: "suggestie",
        description: "Vul hier je suggestie in.",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  {
    name: "botcommands",
    description: "Maak botcommand embed"
  },
  {
    name: "ticket",
    description: "Maak de ticket embed"
  },
  {
    name: "ban",
    description: "Ban persoon uit de Discord Server.",
    options: [
      {
        name: "ban",
        description: "Welke speler wil je bannen?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "reden",
        description: "Waarom word deze persoon verbannen?",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  {
    name: "staffsollicitatie",
    description: "Maak staffsollicitatie Embed"
  },
  {
    name: "hulpdienstensollicitatie",
    description: "Maak hulpdienstensollicitatie Embed"
  }
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(`${json.clientID}`), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const user = interaction.options.getUser("user")

  if(interaction.commandName === "verifyembed")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      const embed = new EmbedBuilder()
      .setTitle("Verifiëren")
      .setDescription(`Welkom bij **Zaandam Roleplay**\nZorg ervoor dat je <#1209520899540123730> goed hebt gelezen.\nZo ja, dan kan jij je verifiëren met de onderstaande knop.`)
      .setColor(json.successcolor)
      .setThumbnail(json.icon)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      const create = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setCustomId("captcha")
          .setLabel("Verifieer Je Account")
          .setStyle(2)
          )
          interaction.client.channels.fetch('1209520899540123731')
          .then(channel => {
              channel.reply({embeds: [embed], components: [create]});
              SendLog(interaction, user, interaction.commandName)
              SuccesReply(interaction)
          })
    } else {
      noPerms(interaction);
    }
  } else if (interaction.commandName === "clear") 
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
    {
      const nummer = interaction.options.getNumber("nummer")
      if(!nummer) return Error(interaction, "Voer het aantal berichten in dat je wilt verwijderen.");
      if (isNaN(nummer)) return Error(interaction, "Voer een getal in!");
      
      if(nummer > 100) return Error(interaction, "Je kunt niet meer dan 100 berichten verwijderen");
      if(nummer < 1) return Error(interaction, "Je moet minimaal één bericht verwijderen");
      
      await interaction.channel.messages.fetch({limit: nummer}).then(messages => {
        interaction.channel.bulkDelete(messages);
        SuccesReply(interaction)
        SendLog(interaction, user, interaction.commandName)
      });
    } else {
      noPerms(interaction)
    }
  } else if (interaction.commandName === "botreload")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      SendLog(interaction, user, interaction.commandName)
      console.clear()
      SuccesReply(interaction)
      client.destroy()
      client.login(json.token)
      return
    } else {
      noPerms(interaction)
    }
  } else if(interaction.commandName === "regelsembed")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      SendLog(interaction, user, interaction.commandName)
      const embed = new EmbedBuilder()
      .setTitle("📜 · Discord Regels")
      .setDescription(`Welkom bij **Zaandam Roleplay**\nOnderstaand aan dit bericht staan een paar regels. Zorg ervoor dat je deze regels goed leest om onze huisregels beter te leren kennen.`)
      .addFields( { name: `Respectvol gedrag:`, value: `Behandel elkaar met respect en vriendelijkheid. Discriminatie, beledigingen, pesten en haatzaaien is niet toegestaan.`} )
      .addFields( { name: `Geen spam:`, value: `Voorkom overmatig spammen van berichten, links of andere inhoud. Dit kan de chatervaring negatief beïnvloeden.`} )
      .addFields( { name: `Geen NSFW-content:`, value: `Plaats geen inhoud die als niet geschikt voor werk (NSFW) kan worden beschouwd. Houd het platform veilig en geschikt voor alle leeftijden.`} )
      .addFields( { name: `Geen ongepaste taal:`, value: `Vermijd vulgair taalgebruik en grof taalgebruik. Houd de conversaties beleefd en respectvol.`} )
      .addFields( { name: `Geen zelfpromotie zonder toestemming:`, value: ` Het plaatsen van zelfpromotie of reclame is alleen toegestaan met toestemming van de beheerder.`} )
      .addFields( { name: `Gebruik de juiste kanalen:`, value: `Zorg ervoor dat leden de juiste kanalen gebruiken voor specifieke soorten discussies. Dit helpt bij het organiseren van de inhoud.`} )
      .addFields( { name: `Rapporteer problemen:`, value: ` Als je getuige bent van schendingen van de regels, meld dit dan bij de staff-leden. Geef zoveel mogelijk informatie om een passende actie te kunnen ondernemen.`} )
      .setColor(json.color)
      .setThumbnail(json.icon)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      interaction.client.channels.fetch('1209520899540123730').then(channel => {
        channel.send({embeds: [embed]})
      })
    }
  } else if(interaction.commandName === "suggestie")
  {
    const suggestie = interaction.options.getString("suggestie")
    const embed = new EmbedBuilder()
    .setTitle("❓ · Nieuwe Suggestie")
    .setColor(json.color)
    .setDescription(suggestie + "\n\n**Doormiddel van /suggestie (Wat voor suggestie heb je?) kan jij ook een suggestie aanmaken.**")
    .setThumbnail(json.icon)
    .setTimestamp()
    .setFooter({ text: `${json.footerText} · Suggestie Gemaakt Door ${interaction.user.tag}`, iconURL: json.icon})
    interaction.client.channels.fetch('1209520900261679185').then(suggestieChannel => {
      suggestieChannel.send({embeds: [embed]}).then(msg => {
        msg.react("✅"); 
        msg.react("❌")
    })
    })
  } else if(interaction.commandName === "voertuigsuggestie")
  {
    const suggestie = interaction.options.getString("suggestie")
    const embed = new EmbedBuilder()
    .setTitle("❓ · Nieuwe Voertuig Suggestie")
    .setColor(json.color)
    .setDescription(suggestie + "\n\n**Doormiddel van /voertuigsuggestie (Welke auto wil je zien? Wat moet er veranderen?) kan jij ook een voertuig suggestie aanmaken.**")
    .setThumbnail(json.icon)
    .setTimestamp()
    .setFooter({ text: `${json.footerText} · Suggestie Gemaakt Door ${interaction.user.tag}`, iconURL: json.icon})
    interaction.client.channels.fetch('1209520900261679186').then(suggestieChannel => {
      suggestieChannel.send({embeds: [embed]}).then(msg => {
        msg.react("✅"); 
        msg.react("❌")
    })
    })
  } else if(interaction.commandName === "botcommands")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      const embed = new EmbedBuilder()
      .setTitle("🤖 · Botcommands")
      .setColor(json.color)
      .addFields( { name: "Suggestie Aanmaken", value: "/suggestie (Suggestie die je wilt doen.)"} )
      .addFields( { name: "Voertuig Suggestie Aanmaken", value: "/voertuigsuggestie (Voertuigsuggestie die je wilt doen.)"} )
      .setThumbnail(json.icon)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      interaction.client.channels.fetch('1209520900005830764').then(channel => {
        channel.send({embeds: [embed]})
      })
    } else {
      noPerms(interaction)
    }
  } else if(interaction.commandName === "ticket")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      const embed = new EmbedBuilder()
      .setTitle("🎫 · Zaandam Tickets")
      // .setDescription("Beste Burgers van **Zaandam**\nWij staan klaar om jullie te helpen👋\nWij hebben verschillende categorieën waar jullie uit kunnen kiezen.\n\n**Categorieën:**\n> ❗ - Klacht Ticket\n> ❓ - Vraag Ticket\n> ♻️ - Refund Ticket\n > ☠️ - Onderwereld Ticket\n > 🎫 - Unban Ticket\n > 🛠️ - Development Ticket\n > 📚 - Sollicitatie Ticket\n\nKies de Categorie die het meest bij jou past.")
      .setDescription("**Geachte Inwoners van Zaandam**\n\nWij heten jullie hartelijk welkom en staan klaar om met alle plezier te assisteren. 👋 Binnen ons systeem hebben we verschillende categorieën beschikbaar, zodat jullie eenvoudig kunnen aangeven waarvoor jullie hulp nodig hebben.\n\n**Categorieën:**\n\n > ❗ Klacht Ticket\n > ❓Vraag Ticket\n > ♻️ Refund Ticket\n > ☠️ Onderwereld Ticket\n > 🎫 Unban Ticket\n > 🛠️ Development Ticket\n > 📚 Sollicitatie Ticket\n\nKies alsjeblieft de categorie die het best aansluit bij jouw behoeften. We zijn er om te zorgen dat jouw vragen of verzoeken de aandacht krijgen die ze verdienen.\n\n**Met vriendelijke groet,**\n**Het <@&1209520898915176543> team**")
      .setColor(json.color)
      .setThumbnail(json.icon)
      // .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      const create = new ActionRowBuilder()
      .addComponents(
          new StringSelectMenuBuilder()
          .setCustomId("row")
          .setPlaceholder("Niks Geselecteerd")
          .addOptions([
              {
                  label: "❗ Klacht Ticket",
                  value: "klacht"
              },
              {
                  label: "❓ Vraag Ticket",
                  value: "vraag"
              },
              {
                  label: "♻️ Refund Ticket",
                  value: "refund"
              },
              {
                  label: "☠️ Onderwereld Ticket",
                  value: "onderwereld"
              },
              {
                  label: "🎫 Unban Ticket",
                  value: "unban"
              },
              {
                  label: "🛠️ Development Ticket",
                  value: "development"
              },
              {
                  label: "📚 Sollicitatie Ticket",
                  value: "sollicitatie"
              },
          ])
      )
      interaction.client.channels.fetch('1209520900538634255')
      .then(channel => {
          channel.send({embeds: [embed], components: [create]});
      })
    }
  } else if(interaction.commandName === "ban")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
    {
      const banUser = interaction.options.getUser("ban")
      const reden = interaction.options.getString("reden")
      SuccesReply(interaction)
      BanLog(interaction, banUser, reden)
      interaction.guild.members.fetch(banUser).then(ban => {
        ban.ban({reason: reden})
      })

    } else {
      noPerms(interaction)
    }
  } else if(interaction.commandName === "staffsollicitatie")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      const embed = new EmbedBuilder()
      .setTitle("Zaandam Roleplay | Staff")
      .setDescription("Onze bloeiende community, Zaandam Roleplay, zoekt gemotiveerde individuen om ons FiveM-serverteam te versterken! Als onderdeel van ons team krijg je de kans om betrokken te raken bij een levendige ervaring en bij te dragen aan de groei van onze gemeenschap. Hier zijn de beschikbare posities:\n")
      .addFields({name: "🔰|Management:", value: " > Coördineer en beheer alle aspecten van Zaandam Roleplay.\n> Ervaring in leiderschap en organisatie is vereist."})
      .addFields({name: "🔱|Admin:", value: " > Handhaaf serverregels en bied ondersteuning aan spelers.\n> Ervaring met serverbeheer en probleemoplossing is een pluspunt."})
      .addFields({name: "🔱|Junior Admin:", value: " > Ondersteun het admin-team en ontwikkel nieuwe vaardigheden.\n> Training wordt voorzien, geen ervaring vereist."})
      .addFields({name: "💠|Moderator:", value: " > Houd toezicht op in-game activiteiten en behandel regelovertredingen.\n> Goede communicatievaardigheden zijn cruciaal."})
      .addFields({name: "💠|Junior Moderator:", value: " > Help bij moderatietaken en leer van ervaren moderators.\n> Geen ervaring vereist, bereidheid om te leren is essentieel."})
      .addFields({name: "🎫|Ticket en Support:", value: " > Beantwoord vragen en los problemen op via ons ticketsysteem.\n> Vriendelijke houding is vereist."})
      .addFields({name: "🚨|Hulpdiensten Coördinator:", value: " > Coördineer in-game hulpdiensten zoals Politie, Anwb, en Ambulance.\n> Ervaring met roleplay is een pluspunt."})
      .addFields({name: "🔰|Staff Coördinator:", value: " > Overzie het personeelsbeheer en organiseer staffmeetings.\n> Leiderschap en communicatievaardigheden zijn vereist."})
      .addFields({name: "🔫| Onderwereld Coördinator:", value: " > Beheer in-game criminele activiteiten en verhaallijnen.\n> Ervaring met roleplay en creativiteit zijn belangrijk.\n\n"})
      .addFields({name: "Solliciteer nu en word een waardevol lid van Zaandam Roleplay!", value: "\nSolliciteren kan via: <#1209520900538634255>"})
      .setThumbnail(json.icon)
      .setColor(json.color)
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      interaction.client.channels.fetch('1209520900005830758')
      .then(channel => {
          channel.send({embeds: [embed]});
      })

    } else {
      noPerms(interaction)
    }
  } else if(interaction.commandName === "hulpdienstensollicitatie")
  {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    {
      const embed = new EmbedBuilder()
      .setTitle("Zaandam Roleplay | Hulpdiensten")
      .setDescription("Zaandam Roleplay is op zoek naar mensen om verschillende leidende rollen te vervullen binnen Zaandam:")
      .addFields({name: "👮🏼 | Eerste Hoofd Commissaris:", value: " > Leid en coördineer het politiekorps binnen Zaandam Roleplay.\n> Ervaring in roleplay en politieprotocollen is vereist.\n> Vermogen om een team te motiveren en te begeleiden."})
      .addFields({name: "👮🏼 | Hoofd Commissaris:", value: " > Ondersteun en werk samen met het Eerste Hoofd Commissaris in de leiding van de politie.\n> Ervaring in roleplay en kennis van wetshandhaving zijn een pluspunt."})
      .addFields({name: "👮🏼 | IBT Docent:", value: " > Geef training in de Instructie BeveiligingsTaken aan aspiranten.\n> Ervaring politieprocedures zijn vereist."})
      .addFields({name: "👮🏼 | Politie (👮🏼 | Aspirant):", value: " > Volg trainingen en werkzaamheden als aspirant.\n> Geen ervaring vereist bereidheid om te leren is essentieel."})
      .addFields({name: "💂 | Luitenant Generaal:", value: " > Leid en coördineer de Koninklijke Marechaussee.\n> Ervaring in roleplay en kennis van militaire protocollen zijn vereist."})
      .addFields({name: "💂 | Generaal Majoor:", value: " > Ondersteun de Luitenant Generaal in de leiding van de Marechaussee.\n> Ervaring in leiderschap en samenwerking binnen een team is een pluspunt."})
      .addFields({name: "💂 | Koninklijke Marechaussee (💂 | Kornet):", value: " > Volg trainingen en werkzaamheden als Kornet-Marechaussee.\n> Geen ervaring vereist, bereidheid om te leren is essentieel."})
      .addFields({name: "🔧 | ANWB Directeur:", value: " > Leid en coördineer de ANWB-afdeling binnen Zaandam Roleplay.\n> Ervaring in roleplay en kennis van autohulpverlening zijn vereist."})
      .addFields({name: "🔧 | ANWB (🔧 | Stagiair):", value: " > Volg trainingen en werkzaamheden als ANWB-stagiair.\n> Geen ervaring vereist, bereidheid om te leren is essentieel."})
      .addFields({name: "🚑 | Ambulance Leiding:", value: " > Leid en coördineer de ambulanceafdeling.\n> Ervaring in roleplay en kennis van medische procedures zijn vereist."})
      .addFields({name: "🚑 | Ambulance (🚑 | Broeder):", value: " > Volg trainingen en werkzaamheden als ambulancebroeder.\n> Geen ervaring vereist, bereidheid om te leren is essentieel."})
      .addFields({name: "Als je enthousiast bent over het vervullen van een van deze belangrijke rollen binnen Zaandam", value: "\nSolliciteren kan via: <#1209520900538634255>"})
      .setThumbnail(json.icon)
      .setColor(json.color)
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      interaction.client.channels.fetch('1209520900005830758')
      .then(channel => {
          channel.send({embeds: [embed]});
      })
    } else {
      noPerms(interaction)
    }
  }
});

function Error(interaction, desc) {
  const embed = new EmbedBuilder()
  .setTitle("⚠️ · Error")
  .setColor(json.errorcolor)
  .setDescription(desc)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.reply({embeds: [embed]}).then(message => {
    setTimeout(function() {
      message.delete()
    }, 5000)
  })
  return
}

function noUser(interaction)
{
  const embed = new EmbedBuilder()
  .setTitle("⚠️ · Error")
  .setColor("#ff0000")
  .setDescription("Deze gebruiker is niet gevonden.")
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.reply({embeds: [embed]});
}

function SuccesReply(interaction)
{
  const embed = new EmbedBuilder()
  .setTitle("🏆 · Succesvol")
  .setColor(json.successcolor)
  .setDescription("Command Succesvol Uitgevoerd")
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.reply({embeds: [embed]}).then(message => {
    setTimeout(function() {
      message.delete()
    }, 5000)
  })
  return
}

function BanLog(interaction, user, reden)
{
  const embed = new EmbedBuilder()
  .setTitle(`📝 · Zaandam Discord Ban Logs`)
  .setColor(json.color)
  .setDescription(`${user} Is verbannen uit **Zaandam Roleplay**.\n\n**Verbannen Door:**\n<@${interaction.user.id}>\n\n**Reden:**\n${reden}`)
  .setThumbnail(json.icon)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.client.channels.fetch("1210936847891431505")
  .then(channel => {
      channel.send({embeds: [embed]});
  })
}

function SendLog(interaction, user, commandName)
{
  const embed = new EmbedBuilder()
  .setTitle(`📝 · Zaandam Discord Logs`)
  .setColor(json.color)
  .setDescription(`<@${interaction.user.id}> Heeft **${commandName}** command gebruikt`)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.client.channels.fetch(json.logchannel)
  .then(channel => {
      channel.send({embeds: [embed]});
      channel.send({content: `<@&1209520898915176543>`})
  })
}

function noPerms(interaction) {
  const embed = new EmbedBuilder()
  .setTitle("🚫 · Geen Permissies")
  .setColor(json.errorcolor)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  interaction.reply({embeds: [embed]}).then(message => {
    setTimeout(function() {
      message.delete()
    }, 5000)
  })
  return
}

client.on("interactionCreate", async interaction => {
  if(!interaction.isStringSelectMenu()) return;
  const embed = new EmbedBuilder()
  .setTitle("🎫 · Zaandam Tickets")
  .setDescription(`**Beste <@${interaction.user.id}>**\n\nHartelijk welkom bij je ticket! Hier bij het Staff Team staan we klaar om je te helpen met eventuele vragen, problemen of verzoeken die je hebt.\n\nOns toegewijde team zal er alles aan doen om je zo snel mogelijk de ondersteuning te bieden die je nodig hebt. We waarderen je geduld en begrip terwijl we aan de slag gaan met je ticket.\n\nGelieve geen tags te plaatsen en wees ervan verzekerd dat we je ticket nauwlettend in de gaten houden. Als je geen verdere informatie wilt toevoegen of als je denkt dat je vraag is opgelost, kun je het ticket op elk moment sluiten met behulp van de onderstaande knop.\n\n**Met vriendelijke groet,\nHet <@&1209520898915176543> Team**`)
  .setColor(json.color)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  const close = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
      .setCustomId("close")
      .setLabel("🗑️")
      .setStyle("Danger")
  )
  await interaction.deferUpdate({ephemeral: false}).catch(() => {});
  if(interaction.customId === "row") {
      interaction.values.forEach(async value => {
          if(value === "klacht") {
              interaction.guild.channels.create({
                name: `klacht-ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: '1210712797688631296', // Categorie id
                  permissionOverwrites: [
                      {
                          id: interaction.user.id,
                          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                      },
                      {
                          id: "1209520898915176543",
                          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                      },
                      {
                          id: "1210237228236800030", // De bot id
                          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                      },
                      {
                          id: interaction.guild.roles.everyone,
                          deny: [PermissionsBitField.Flags.ViewChannel],
                      }
                  ],
              }).then(async(channel) => {
                  channel.send({embeds: [embed], components: [close]});
              })
          } else if(value === "vraag") {
            interaction.guild.channels.create({
              name: `vraag-ticket-${interaction.user.username}`,
              type: ChannelType.GuildText,
              parent: '1210713253173403788',
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: "1209520898915176543",
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: "1210237228236800030",
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    }
                ],
          
            }).then(async(channel) => {
                channel.send({embeds: [embed], components: [close]});
            })
          } else if(value === "refund") {
          interaction.guild.channels.create({
            name: `refund-ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1210713302775103518',
              permissionOverwrites: [
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: "1209520898915176543",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: "1210237228236800030",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: interaction.guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                  }
              ],
          }).then(async(channel) => {
              channel.send({embeds: [embed], components: [close]});
          })
          } else if(value === "onderwereld") {
          interaction.guild.channels.create({
            name: `onderwereld-ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1210713348782432346',
              permissionOverwrites: [
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: "1209520898915176543",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: "1210237228236800030",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: interaction.guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                  }
              ],
          }).then(async(channel) => {
              channel.send({embeds: [embed], components: [close]});
          })
          } else if(value === "unban") {
          interaction.guild.channels.create({
            name: `unban-ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1210713401253437500',
              permissionOverwrites: [
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: "1209520898915176543",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: "1210237228236800030",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: interaction.guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                  }
              ],
          }).then(async(channel) => {
              channel.send({embeds: [embed], components: [close]});
          })
          } else if(value === "development") {
          interaction.guild.channels.create({
            name: `development-ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1210713451731615744',
              permissionOverwrites: [
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: "1209520898915176543",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: "1210237228236800030",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: interaction.guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                  }
              ],
          }).then(async(channel) => {
              channel.send({embeds: [embed], components: [close]});
          })
          } else if(value === "sollicitatie") {
          interaction.guild.channels.create({
            name: `sollicitatie-ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1210713492785598554',
              permissionOverwrites: [
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: "1209520898915176543",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: "1210237228236800030",
                      allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                      id: interaction.guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                  }
              ],
          }).then(async(channel) => {
              channel.send({embeds: [embed], components: [close]});
          })
        }
    })
  }
})

client.on('interactionCreate', async(button, guildMember) => {
  if (!button.isButton()) return;
  if (!button.isMessageComponent()) return
  await button.deferUpdate({ephemeral: false}).catch(() => {});
  const embed = new EmbedBuilder()
  .setTitle("🎫 · Zaandam Tickets")
  .setDescription("```Waar kunnen wij u mee helpen het is verboden te taggen wij zullen u zo snel mogelijk antwoorden dus even geduld aub```")
  .setColor(json.color)
  .setTimestamp()
  .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
  const close = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
      .setCustomId("close")
      .setLabel("🗑️")
      .setStyle("Danger")
  )
  if(button.customId === "close") {
      const embed = new EmbedBuilder()
      .setTitle("🎫 · Zaandam Tickets")
      .setDescription("Weet je zeker dat je de ticket wilt sluiten?")
      .setColor(json.color)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      const sure = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setCustomId("yes")
          .setLabel("Ja")
          .setStyle("Success")
      )
      .addComponents(
          new ButtonBuilder()
          .setCustomId("no")
          .setLabel("Nee")
          .setStyle("Danger")
      )
      button.channel.send({embeds: [embed], components: [sure]})
  } else if(button.customId === "yes") {
      const embed = new EmbedBuilder()
      .setTitle("🎫 · Zaandam Tickets")
      .setDescription("Je ticket zal sluiten in 3 seconden.")
      .setColor(json.color)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      button.channel.send({embeds: [embed]})
      setTimeout(function() {
          button.channel.delete()
      }, 3000)
  } else if(button.customId === "no") {
      const embed = new EmbedBuilder()
      .setTitle("🎫 · Zaandam Tickets")
      .setDescription("Je ticket is successvol opengehouden")
      .setColor(json.color)
      .setTimestamp()
      .setFooter({ text: `${json.footerText}`, iconURL: json.icon})
      button.channel.send({embeds: [embed]})
  }
})

client.login(`${json.token}`);
import { Message, MessageEmbed, CategoryChannel } from 'discord.js';
import { Command } from 'discord-akairo';
import { Util } from '@atomic/util/Util';
import { stripIndents } from 'common-tags';
import * as PrettyMS from 'pretty-ms';
export default class ServerInfoCommand extends Command {
	public constructor() {
		super('serverinfo', {
			aliases: ['serverinfo', 'guildinfo', 'si', 'gi'],
			category: 'Information',
			description: {
				content: 'Displays all the info about the current guild',
				usage: '$serverinfo',
				examples: ['$serverinfo']
			}
		});
	}

	public async exec(message: Message): Promise<any> {
		const {
			premiumTier,
			premiumSubscriptionCount,
			region,
			name,
			id,
			ownerID,
			afkChannelID,
			available,
			members,
			memberCount,
			maximumMembers,
			emojis,
			explicitContentFilter,
			description,
			channels,
			createdAt,
			rulesChannelID,
			roles,
			joinedAt
		} = message.guild;
		if (!available) return;
		const Embed: MessageEmbed = this.client.embed(message, {}).setDescription(
			stripIndents`  
    **❯** Name: ${name}
    **❯** ID: ${id}
    **❯** Description: ${description ?? 'No description'}
    **❯** Created: ${new Intl.DateTimeFormat('en-US')
			.format(createdAt)
			.replace(/\//g, '-')} (${PrettyMS.default(
				Date.now() - Date.parse(createdAt.toISOString()),
				{ compact: true, verbose: true }
			)} ago)
    **❯** Members: ${memberCount} / ${maximumMembers}
    **❯** Channels: ${
			channels.cache.filter((v) => {
				return !(v instanceof CategoryChannel);
			}).size
		}
    **❯** Roles: ${Util.trim(
			roles.cache
				.sort((h, r) => r.position - h.position)
				.map((r) => r.toString()),
			3
		)}
    **❯** Emojis: ${Util.trim(
			emojis.cache.map((e) => e.toString()),
			6
		)}
    **❯** Owner: ${await message.guild.members.fetch(ownerID)}
    **❯** Region: ${Util.capitalize(region)}
    **❯** Explicit Content Filter: ${explicitContentFilter
			.split('_')
			.map((v) => {
				return Util.capitalize(v);
			})
			.join(' ')}
    **❯** Boosting Tier: ${premiumTier}
    **❯** Boost Count: ${premiumSubscriptionCount}

    **❯** Humans: ${members.cache.filter((u) => !u.user.bot).size}
    **❯** Bots: ${members.cache.filter((u) => u.user.bot).size}
    **❯** Members Online: ${
			members.cache.filter((u) => {
				return u.user.presence.status !== 'offline';
			}).size
		}
    **❯** Bot Invited: ${new Intl.DateTimeFormat('en-US')
			.format(joinedAt)
			.replace(/\//g, '-')} (${PrettyMS.default(
				Date.now() - Date.parse(joinedAt.toISOString()),
				{
					compact: true,
					verbose: true
				}
			)} ago)
    
    **❯** AFK Channel: ${
			afkChannelID ? channels.cache.get(afkChannelID) : 'None'
		}
    **❯** Rules Channel: ${
			rulesChannelID ? channels.cache.get(rulesChannelID) : 'None'
		}
    **❯** News Channel: ${
			channels.cache
				.filter((g) => {
					return g.type === 'news';
				})
				.first() ?? 'None'
		}`
		);
		message.guild.icon
			? Embed.setThumbnail(message.guild.iconURL({ dynamic: true }))
			: null;
		message.util.send(Embed);
	}
}

import { Message } from 'discord.js';
import { Command, Listener } from 'discord-akairo';
export default class CommandBlockedListener extends Listener {
	public constructor() {
		super('commandBlocked', {
			event: 'commandBlocked',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	public async exec(message: Message, command: Command, reason: string) {
		switch (reason) {
			case 'owner':
				message.util
					.send(
						this.client
							.embed(message, {})
							.setTitle('Blocked')
							.setDescription(`The ${command.id} command is owner only.`)
					)
					.then((m) => {
						setTimeout(() => {
							m.delete();
						}, 3000);
					});
				break;

			default:
				break;
		}
	}
}

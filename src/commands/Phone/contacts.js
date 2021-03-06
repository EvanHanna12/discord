const Phone = require('../../classes/Phone.js');
const {Command} = require('dolphin-discord');
const utils = require('../../../utils/utils.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'contacts',
            description: 'Displays your saved contacts',
            syntax: 'contacts'
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let phone = await Phone.getByUserID(this.message.author.id);
        if (phone.contacts.length == 0) return this.message.say(`:cry: You don't have any contact saved. Add one using \`.addcontact\``);

        let pages = utils.pagify(phone.contacts, 10);

        const getPage = (page, pageNumber) => {
            let description = page.map(contact => `:bust_in_silhouette: **${contact.name}** \`${contact.phone}\``);
    
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s Contacts`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${pages.length}`, this.client.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(description);
        }

        this.createPagination({items: pages, getPage: getPage, userID: this.message.author.id});
    }
}
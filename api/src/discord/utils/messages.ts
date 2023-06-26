import { TextChannel } from "discord.js";

export async function sendMessageToChannel(
  channel: TextChannel,
  message: string,
  silent = true
) {
  const options = {
    content: message,
    allowedMentions: {
      users: [],
    },
    flags: [] as number[],
  };

  // still send the message if the last message was sent by the bot and within ten minutes interval
  if (!silent) {
    const latestMessages = await channel.messages.fetch({ limit: 1 });
    if (latestMessages.size > 0) {
      const lastMessage = latestMessages.first();
      if (
        lastMessage?.author.username === BOT_NAME &&
        lastMessage?.createdTimestamp > Date.now() - 600000
      ) {
        silent = true;
      }
    }
  }

  if (silent) {
    options.flags = [4096];
  }

  return await channel.send(options).catch((err) => {
    console.error("Failed to send message to channel", channel, message, err);
  });
}

# This current structure of the bot is not great

Optimally, there should be a single instance of the bot with localhost ports exposed that interacts with the api server

This way, the web server can shard into multiple instances while the bot can shard on its own.

However, due to the sheer complexity of Discord's API, I would probably never do such a thing and just rely on having multiple bots logged in

Bad for memory, bad for performance, also we can't shard this api server. Instead, we can just buy a better server and ignore this problem.

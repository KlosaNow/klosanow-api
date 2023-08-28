## THis is vercel configuration only,
## The config is temporary, so that it can be able to run on vercel

# NB

##### On src/server.ts

export default app  >> This is added for vercel config, it will be later remove when going live.

#### api/index.ts

This is for vercel config as well

## For AWS services authentication

changed env variable for Access key

default=AWS_ACCESS_KEY

current= AWS_ACCESS_KEYS

the default format is a reserved key word in most platforms, and vercel happens to reserve the word for their own use case, therefore to set up env variable, S was added for differentaition.
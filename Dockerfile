FROM node:20.11.1-bullseye-slim As stage
# Set Working Dir
WORKDIR /app
# Copy package.json file
COPY . .
COPY package.json package-lock.json ./
# Install packages
RUN yarn install
RUN export NODE_OPTIONS=--max_old_space_size=4096 && yarn run build
# Running Stage
FROM node:20.11.1-bullseye-slim
# Set Directory
WORKDIR /app
# Add user and group
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 yarn
RUN chown -R yarn:nodejs ./
COPY --from=stage --chown=yarn:nodejs /app/node_modules /app/node_modules
COPY --from=stage --chown=yarn:nodejs /app/dist /app/dist
COPY --from=stage --chown=yarn:nodejs /app/package.json /app/package.json
EXPOSE 5000
# Start the Application with user not root user
USER 1001
# Add Start Command
ENTRYPOINT ["yarn", "start"]
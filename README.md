# Voxel Realms (MERN)

A Minecraft-style voxel game with accounts and online multiplayer.

- **M**ongoDB (Atlas): player accounts
- **E**xpress + **N**ode: login API, serves the site, Socket.IO multiplayer server
- **R**eact (Vite): login page and the play page that hosts the game

The game itself is `client/public/game/index.html` (three.js r128). `mp-shim.js` connects its multiplayer to this server, so friends on **different accounts** can play together: same world code = same world, you see each other, chat, and invites by username.

## Deploy on Render (free)

1. **Database (MongoDB Atlas, free):** create a free cluster, add a database user, and in *Network Access* allow `0.0.0.0/0` (Render's IP changes). Copy the connection string (`mongodb+srv://...`) and put a database name in it, for example `/voxelrealms`.
2. **GitHub:** create a new repository and push this folder to it.
3. **Render:** *New* -> *Blueprint* -> pick the repository. Render reads `render.yaml`, creates the web service and makes `JWT_SECRET` for you. Paste your Atlas string into `MONGODB_URI` and deploy.
4. Open your `https://voxel-realms-xxxx.onrender.com` link, create an account, and share the link with friends. Each friend makes their own account.

Until `MONGODB_URI` is set, the server runs in **test mode**: it starts and works, but accounts are kept in memory and disappear when it restarts. If `JWT_SECRET` is missing the server makes a temporary one, which logs everyone out on restart.

Free Render services sleep after about 15 minutes with nobody online; the first visit after that takes about a minute to wake up.

## Run on your computer

```bash
cp server/.env.example server/.env   # then fill in MONGODB_URI and JWT_SECRET
npm run build
npm start                            # http://localhost:3000
```

For live editing of the React app run `npm run dev:server` and `npm run dev:client` in two terminals (the Vite dev server proxies `/api` and `/socket.io`).

## Design

The menus, HUD and login page share one design system, written up in `DESIGN.md` (colours, fonts, buttons, tabs, toggles, pixel icons). Keep new screens inside it so everything feels like one game.

## How multiplayer works

Each player sends their presence (name, world code, position, skin, last chat message, invites) about 10 times a second over Socket.IO; the server sends the full player list back 10 times a second and the game shows players in the same world code. The server always uses the account username as the player name, masks a few swear words in chat, and rejects oversized messages. Building, mobs and time of day are still per player.

## Versions

Node 20 on Render (Node 18+ works). express ^4.19.2, mongoose ^8.4.0, socket.io ^4.7.5, jsonwebtoken ^9.0.2, bcryptjs ^2.4.3, express-rate-limit ^7.2.0, dotenv ^16.4.5, react ^18.3.1, vite ^5.2.11.

# Imposter Word Game

A fun multiplayer browser-based party game where one player is the imposter who doesn't know the secret word. Players give one-word clues, discuss, vote, and try to identify the imposter.

## Features

- **Real-time Multiplayer**: Play with 3+ friends in real-time
- **6 Themed Word Lists**: Default, Pokémon, NBA Players, Memes, Movies, Countries
- **Mobile-Friendly**: Responsive design that works on all devices
- **No Account Required**: Just create a room and share the code
- **Instant Play**: No downloads or installations needed

## Game Flow

1. **Lobby**: Host creates a room, players join with a room code
2. **Role Assignment**: One random player becomes the imposter
3. **Word Reveal**: All players except the imposter see the secret word
4. **Clue Round**: Each player submits a one-word clue
5. **Discussion**: Players review all clues
6. **Voting**: Players vote for who they think is the imposter
7. **Results**: Reveal who the imposter was and who won

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Realtime**: Supabase Realtime (optional, can use localStorage for local testing)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account (optional, for production realtime features)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd imposter
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: For local development without Supabase, the app uses localStorage for room state management.

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  page.tsx                      # Landing page
  layout.tsx                    # Root layout with metadata
  create/page.tsx               # Create room page
  join/page.tsx                 # Join room page
  room/[roomId]/page.tsx        # Main game page
  globals.css                   # Global styles

/components
  /Game
    Lobby.tsx                   # Lobby screen
    RoleReveal.tsx              # Role reveal screen
    SubmitClue.tsx              # Clue submission screen
    RevealClues.tsx             # Clue reveal screen
    Vote.tsx                    # Voting screen
    Results.tsx                 # Results screen
  /UI
    Button.tsx                  # Button component
    Input.tsx                   # Input component
    Card.tsx                    # Card component
    Modal.tsx                   # Modal component

/lib
  game.ts                       # All game logic
  realtime.ts                   # Realtime sync logic
  supabase.ts                   # Supabase client
  util.ts                       # Utility helpers

/schema
  index.ts                      # TypeScript types

/data
  themes.ts                     # Theme configurations
  default.json                  # Default word list
  pokemon.json                  # Pokémon word list
  nba.json                      # NBA players word list
  memes.json                    # Memes word list
  movies.json                   # Movies word list
  countries.json                # Countries word list
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

### Custom Domain

1. Go to your Vercel project settings
2. Add your custom domain (e.g., `imposterwordgame.com`)
3. Follow DNS configuration instructions

## SEO Optimization

The app is pre-configured with SEO-friendly metadata in `app/layout.tsx`:

- Optimized title and description
- Open Graph tags for social sharing
- Twitter Card support
- Relevant keywords for search ranking

### Target Keywords

- "imposter word game online"
- "word guessing party game"
- "multiplayer browser game"
- "online party game"
- "pokémon guessing game"
- "NBA player word game"

## Monetization Options

### 1. Google AdSense
Add AdSense scripts to display ads during gameplay.

### 2. Premium Themes
Offer paid theme packs:
- Unlock all themes for $4.99 one-time
- Or $1.99/month subscription

### 3. Remove Ads
$2.99 to remove all ads permanently.

### 4. Custom Word Lists
Allow users to create custom word lists for $0.99 each.

## Future Enhancements

- [ ] Add timer for clue submissions
- [ ] Allow multiple imposters (configurable)
- [ ] Add difficulty levels
- [ ] Create user accounts for stats tracking
- [ ] Add chat functionality
- [ ] Implement custom word list creator
- [ ] Add sound effects
- [ ] Create mobile app version

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made with Claude Code**

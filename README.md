# Giveaway Randomizer

A modern, animated React application for randomly selecting winners from a list of participants. Perfect for Twitch streamers and content creators who want to run engaging giveaways with a visually appealing carousel animation.

## 🎯 Features

- 🎠 **Animated Carousel**: Beautiful spinning carousel animation that highlights the selected winner
- 👥 **Participant Management**: Add, remove, and manage participants with color-coded badges
- 🎲 **Random Selection**: Fair random selection algorithm with smooth animation
- 🔊 **Sound Effects**: Optional sound effects during the carousel animation
- 💾 **LocalStorage Persistence**: Participants and settings are automatically saved
- 📱 **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful purple-themed interface with smooth animations
- 💬 **Twitch Chat Integration**: Built-in Twitch chat sidebar (collapsible on desktop, bottom sheet on mobile)
- 🎯 **Default Participants**: Pre-loaded with default participant list for quick start
- ⏹️ **Cancel Animation**: Ability to cancel the spinning animation at any time

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd giveaway-randomizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch, making it available at `https://<username>.github.io/giveaway-randomizer/`

## 📖 Usage

1. **Add Participants**: 
   - Enter participant names in the input field and click "Add"
   - Participants are automatically saved to localStorage
   - Default participants are loaded if localStorage is empty

2. **Manage Participants**:
   - Remove individual participants by clicking the × button on their badge
   - Remove all participants using the "Remove All" button
   - Participants are displayed in a responsive grid layout

3. **Select Winner**:
   - Click the "🎲 Spin" button to start the animated carousel
   - The carousel will spin and randomly select a winner
   - Click "Cancel" during animation to stop and reset
   - The winner will be highlighted with a glowing border

4. **Sound Controls**:
   - Toggle sound effects on/off using the volume button
   - Sound setting is saved to localStorage
   - Sound button is disabled during animation

5. **Twitch Chat**:
   - Toggle the Twitch chat sidebar on desktop (3% width when hidden, 25% when visible)
   - On mobile, the chat appears as a bottom sheet overlay
   - Chat button is disabled during carousel animation

6. **Winner Actions**:
   - After a winner is selected, you can:
     - Remove the winner from the participant list
     - Spin again to select a new winner
     - Continue managing participants

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **SCSS Modules** - Scoped CSS styling
- **React Icons** - Icon library
- **React Modal** - Modal components
- **Sass** - CSS preprocessor

## 📁 Project Structure

```
giveaway-randomizer/
├── public/              # Static assets (images, audio, favicons)
├── src/
│   ├── components/      # React components
│   │   ├── Carousel/    # Main carousel component
│   │   ├── ParticipantInput/
│   │   ├── WinnerMenu/
│   │   ├── TwitchChatSidebar/
│   │   └── ...
│   ├── constants/       # Configuration constants
│   ├── functions/       # Utility functions
│   ├── models/          # TypeScript interfaces
│   └── App.tsx          # Main application component
├── index.html           # HTML entry point
└── vite.config.ts       # Vite configuration
```

## 🎨 Customization

### Default Participants

Edit `src/constants/defaultParticipants.ts` to customize the default participant list that loads when localStorage is empty.

### Colors

Modify `src/constants/availableColors.ts` to change the available colors for participant badges.

### Animation Settings

Adjust animation parameters in:
- `src/constants/defaultAnimation.ts` - Animation duration
- `src/constants/accelerationRatio.ts` - Acceleration phase
- `src/constants/decelerationRatio.ts` - Deceleration phase

## 📝 License

MIT

## 🙏 Acknowledgments

Built for Twitch streamers and content creators who want to run engaging giveaways with style.

# Giveaway Randomizer

A modern React application for randomly selecting winners from a list of participants. This is a standalone version inspired by giveaway tools, without any external integrations.

## Features

- 🎲 Random selection from participant list
- 👥 Support for multiple winners
- 🚫 Exclude specific participants
- 📝 Flexible input (new lines, commas, or semicolons)
- 🎨 Modern, responsive UI
- ⚡ Fast and lightweight

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Enter participant names in the "Participants" field (one per line or separated by commas/semicolons)
2. Optionally, enter names to exclude in the "Exclude" field
3. Set the number of winners you want to select
4. Click "🎲 Randomize" to select winners
5. View the selected winners in the results section

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS3 (with animations and gradients)

## License

MIT


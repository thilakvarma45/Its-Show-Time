# Its-Show-Time

Its-Show-Time is a full stack movie ticket booking application that allows users to browse movies, view showtimes, select seats, and book tickets with real time availability.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/thilakvarma45/Its-Show-Time.git
cd Its-Show-Time
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is occupied). Open your browser and navigate to the displayed URL.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Project Structure

```
Show-Time/
├── src/
│   ├── components/     # React components
│   ├── data/          # Mock data
│   └── ...
├── public/            # Static assets
└── package.json       # Dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

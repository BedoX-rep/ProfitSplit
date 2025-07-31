# Business Profit Calculator

A React-based profit sharing calculator application designed for business operations. The application calculates and distributes profits among company members based on configurable percentages, following a specific business flowchart.

## Features

- **Step-by-step Input**: Guided process for entering revenue and expenses
- **Real-time Calculation**: Instant profit calculation and distribution
- **Special Company Handling**: Company gets tax and frames cost refunded
- **Member Management**: Add/remove profit sharing members with percentages
- **Export Functionality**: CSV export and print capabilities
- **Save Calculations**: Store calculations for future reference
- **Recent History**: View previously saved calculations

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for API state management
- **Wouter** for lightweight routing

### Backend/API
- **TypeScript/JavaScript** serverless functions
- **Express.js** for development server
- **In-memory storage** (easily replaceable with database)
- **Zod** for input validation

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --build
```

### Traditional Hosting
```bash
npm run build
# Deploy dist/public folder to any static hosting
```

## Development

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Application pages
│   │   └── types/          # TypeScript types
├── server/                 # Express development server
├── api/                    # Serverless functions
├── shared/                 # Shared types and schemas
└── dist/                   # Built application
```

## API Endpoints

- `POST /api/calculate` - Calculate profit distribution
- `GET /api/calculations` - Get recent calculations
- `GET /api/calculations/:id` - Get specific calculation

## Environment Variables

For production deployment, you may need to configure:

- `DATABASE_URL` (if using persistent storage)
- `NODE_ENV=production`

## Business Logic

The calculator follows this flowchart logic:

1. **Total Revenue** - Starting amount from monthly operations
2. **Monthly Expenses** - Utilities, tax, mortgage, other monthly costs
3. **Non-Monthly Expenses** - Merchandise, labor, loans, other costs
4. **Frames Cost** - Special cost category
5. **Net Profit** = Revenue - All Expenses - Frames Cost
6. **Distribution**:
   - Company gets: Profit percentage + Tax refund + Frames refund
   - Members get: Their percentage of net profit

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for business use.
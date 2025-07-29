# Employee Rating System

## Overview

The Employee Rating System is a web-based application designed to facilitate performance evaluations within organizations. It allows companies to create accounts, manage employees, assign supervisors, and rate employee performance based on customizable criteria over specific time periods.

## Features

- **Role-Based Access Control (RBAC)**: Owners, Supervisors, and Employees have specific permissions.
- **Customizable Rating Criteria**: Organizations define their evaluation metrics.
- **Periodic Ratings**: Employee evaluations are tied to specific time periods.
- **Secure Authentication**: JWT-based authentication and authorization.
- **Scalability**: Supports multiple organizations and thousands of users.

## Tech Stack

- **Next.js** – Server-side rendering (SSR) and static site generation (SSG).
- **Tailwind CSS** – Utility-first CSS for responsive UI.
- **Zustand** – Lightweight state management.
- **TanStack Query** – Data fetching, caching, and synchronization.
- **Zod** – Schema validation for forms and API payloads.
- **MongoDB + Prisma** – Type-safe database interaction.

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v18+)
- MongoDB (or an accessible MongoDB Atlas instance)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/employee-rating-system.git
   cd employee-rating-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL="your_mongodb_connection_string"
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
   JWT_SECRET="your_secret_key"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/employee-rating-system
├── src
│   ├── app        # Next.js pages and API routes
│   ├── components # UI components
│   ├── hooks      # Custom React hooks
│   ├── store      # Zustand state management
│   ├── api        # API integration (TanStack Query)
│   ├── configs    # Configuration files
│   ├── prisma     # Prisma schema and migrations
│   ├── utils      # Utility functions
├── public         # Static assets
├── styles         # Global styles (Tailwind)
├── .env           # Environment variables
├── package.json   # Dependencies and scripts
└── README.md      # Project documentation
```

## Deployment

To build and deploy the application:

```bash
npm run build
npm start
```

For production deployment, consider hosting on **Vercel**, **AWS**, or **DigitalOcean**.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

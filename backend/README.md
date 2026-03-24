# Recipe API Backend

Node.js + Express + TypeScript + Prisma + MySQL

## Setup Instructions

### 1. Create the Database

Open **phpMyAdmin** (http://localhost/phpmyadmin) and:
1. Click "New" in the left sidebar
2. Enter database name: `recipe_app`
3. Select collation: `utf8mb4_general_ci`
4. Click "Create"

### 2. Create the `.env` file

Create a file named `.env` in the `backend` folder with:

```
DATABASE_URL="mysql://root:@localhost:3306/recipe_app"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
```

> ⚠️ If your MySQL has a password, use: `mysql://root:YOUR_PASSWORD@localhost:3306/recipe_app`

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Generate Prisma Client & Push Schema to DB

```bash
npm run db:generate
npm run db:push
```

### 5. Seed the Database (Optional)

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `password`
- Client user: `client@example.com` / `password`
- 6 sample recipes

### 6. Start the Server

```bash
npm run dev
```

Server runs at: http://localhost:3001

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Recipes
- `GET /api/recipes` - List recipes (query params: `query`, `cuisine`)
- `GET /api/recipes/:id` - Get recipe
- `POST /api/recipes` - Create recipe (admin)
- `PUT /api/recipes/:id` - Update recipe (admin)
- `DELETE /api/recipes/:id` - Delete recipe (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status (admin)


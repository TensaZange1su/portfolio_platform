Overview
The Portfolio Platform is a Node.js-based web application that allows users to:

View and manage portfolios.
Access the latest news and stock market data.
Register and log in with optional two-factor authentication.
The platform is built using the following technologies:

Backend: Node.js, Express.js, MongoDB
Frontend: EJS (Embedded JavaScript templates) and Bootstrap 5
APIs: News and stock data APIs (e.g., NewsAPI)
Features
User Authentication:

User registration and login.
Two-factor authentication (2FA) using Speakeasy and QR codes.
Portfolio Management:

View portfolio items with descriptions and images.
Image carousel support via Bootstrap.
News Integration:

Fetch and display the latest news articles from external APIs.
Stock Market Data:

Fetch and display stock information using external financial APIs.
Responsive Design:

User-friendly interface with Bootstrap for responsive layouts.
File Structure
Views
Partials: Shared components like header and footer.
Pages: Specific templates for index, login, register, portfolio, news, and stocks.
Routes
Auth: Handles user registration, login, logout, and 2FA.
Portfolio: Manages portfolio-related actions.
API: Fetches news and stock data from external services.
Models
User: User details including hashed passwords, roles, and 2FA settings.
PortfolioItem: Portfolio items with title, description, and images.
Configurations
Passport: Local strategy for user authentication.
Environment Variables:
MONGO_URI: MongoDB connection string.
SESSION_SECRET: Session encryption key.
SMTP_USER and SMTP_PASS: Email credentials for nodemailer.
Installation
Clone the repository:

bash
Копировать код
git clone <repository-url>
cd portfolio-platform
Install dependencies:

bash
Копировать код
npm install
Configure environment variables:

Create a .env file:
makefile
Копировать код
MONGO_URI=<your-mongodb-uri>
SESSION_SECRET=<your-session-secret>
SMTP_USER=<your-smtp-email>
SMTP_PASS=<your-smtp-password>
Start the server:

bash
Копировать код
npm start
Open the application in a browser at http://localhost:3000.

API Integration
News API: Fetch latest headlines. Replace YOUR_NEWS_API_KEY in routes/api.js with your API key.
Stock API: Fetch stock data. Replace YOUR_FINANCIAL_API_KEY with your financial API key.
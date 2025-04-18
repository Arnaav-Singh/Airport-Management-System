
# Shoe Store Management 👟🛒

A full-stack application for managing shoe inventory, customer data, and purchase orders. Designed to streamline the operations of a retail shoe store using **Node.js**, **Express**, and **MySQL**, with planned integration for a **React.js** frontend.



## 🧰 Features

- 📦 **Product Management**: Add, update, and delete shoe listings
- 👤 **Customer Records**: Manage customer profiles and history
- 🛍️ **Order Processing**: Create, view, and cancel customer orders
- 🗂️ **Inventory Tracking**: Real-time stock updates and reports
- 📈 **Sales Insights**: Track revenue, top-selling products (planned)
- 🔒 **Authentication**: User login and role-based access (upcoming)

---

## 🏗️ Project Structure

```
shoe-store-management/
├── config/           # Database and server configuration
├── controllers/      # Logic for handling requests
├── models/           # Database schemas and queries
├── routes/           # API route definitions
├── server.js         # Main server file
└── README.md         # Project documentation
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: React.js (to be integrated)
- **Deployment**: Firebase (Frontend), AWS (Backend - upcoming)

---

## 🚀 Getting Started

### Requirements

- Node.js & npm
- MySQL server

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Arnaav-Singh/Shoe-Store-Management.git
   cd Shoe-Store-Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=shoe_store
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

---

## 📦 Database Tables

- `products`: Shoe details like name, size, stock, price
- `customers`: Customer information
- `orders`: Orders placed by customers
- `order_items`: Products associated with each order
- `users`: Store staff accounts (planned)

---

## 📡 Sample API Endpoints

- `GET /products` – List all shoes
- `POST /customers` – Add a new customer
- `POST /orders` – Place a new order
- `DELETE /products/:id` – Remove a shoe from inventory

---

## 🔮 Future Enhancements

- 📊 Analytics dashboard
- 🛒 Shopping cart for frontend
- 🔐 Admin & staff roles
- 📱 Mobile-first frontend design
- 📦 Inventory alert system

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request with improvements.

---

## 📜 License

MIT © [Arnaav Singh](https://github.com/Arnaav-Singh)

---

## 📬 Contact

Have ideas or need help?

- GitHub: [@Arnaav-Singh](https://github.com/Arnaav-Singh)
- Email: *arnaavsingh5@gmail.com*

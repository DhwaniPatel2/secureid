# 🔐 SecureID – Identity Management System 
---

## 📌 Project Overview

SecureID is a **secure identity management system** built to demonstrate modern authentication and data protection practices. The project focuses on safeguarding sensitive user information while maintaining a simple and user-friendly interface.

Users can register, log in securely, and access a protected profile dashboard where sensitive data is handled with privacy-first principles.

## 🎥 Project Demo

https://github.com/user-attachments/assets/e32cb337-38d4-42a8-9dda-7d489afa05c1

---

## ✨ Key Features

- 🔒 **Encrypted Data Storage**  
  Sensitive identifiers such as Aadhaar/ID numbers are encrypted before being stored, ensuring data security at rest.

- 🔑 **Token-Based Authentication**  
  Uses a JWT-style authentication mechanism to manage user access without server-side session storage.

- 🌐 **Browser Credential Support**  
  Compatible with modern browser password managers, enabling secure credential storage and auto-fill.

- 🛡️ **Secure Profile Dashboard**  
  Displays user profile information with masking applied to sensitive fields for enhanced privacy.

- 📱 **Responsive User Interface**  
  Built using React with a clean, responsive layout for consistent performance across devices.

---
## 📡 API Documentation (Simulated Microservice)

The service architecture follows RESTful principles for identity management.

### 📝 1. User Registration  
`POST /api/v1/auth/register`

- **Description:** Registers a new user identity and encrypts sensitive ID numbers before storage.
- **Payload:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword",
    "idNumber": "123456789012"
  }
🔐 Security Note: The idNumber is encrypted before being persisted.

### 🔐 2. User Authentication
`POST /api/v1/auth/login`

- **Description:** Validates user credentials and issues a stateless authentication token.
  
- **Payload:**
   ```json
  {
  "email": "jane@example.com",
  "password": "securepassword"
  }

- **Response:**
  ```json
  {
    "token": "header.payload.signature",
    "user": {
      "id": "uuid",
      "fullName": "Jane Doe",
      "email": "jane@example.com"
    }
  }

### 👤 3. Fetch User Profile
`GET /api/v1/user/profile`

- **Description:** Retrieves the authenticated user's profile information.

- **Headers:**
`Authorization: Bearer <JWT_TOKEN>`

- **🔓 Behavior:** Sensitive identity data is decrypted on-the-fly and returned only to verified users.

---

## 🤖 AI Tool Usage Log

| Area | How AI Was Used |
|----|----------------|
| 🔐 Security & Encryption | Used AI to review standard practices for AES-256 encryption and safe IV handling. |
| 🔑 Authentication | Used AI to draft an initial structure for token-based login and validation logic. |
| 🎨 UI Design | Used AI suggestions for layout ideas and accessibility improvements. |
| 🧪 Testing & Debugging | Used AI to identify common edge cases in authentication and profile access flows. |

---

## 📊 Effectiveness Score: **4 / 5**

**Justification:**  
AI tools were used as a productivity aid for research, reference, and initial scaffolding. This reduced time spent on documentation lookup and repetitive setup, while all core logic and security decisions were implemented and verified manually.

---
Author: 
[Dhwani Patel](https://github.com/DhwaniPatel2)

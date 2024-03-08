# DobKonektor Backend (DBK300BE01)

## Introduction

DobKonektor is an innovative web application designed to connect people based on their birthdates. Leveraging a unique concept, it facilitates meaningful interactions among users who share the same birth day, date, or year. This README provides an overview of the backend component of the DobKonektor project, detailing its main features, technology stack, and useful links.

## Main Features

- **Invitation-Only Signup**: Access to DobKonektor is exclusive, requiring an invitation code for account creation.
- **Dynamic Rooms**: Users gain access to three types of rooms:
  - A room for those born on the exact same day.
  - A room connecting individuals sharing the same birth date but in different years.
  - A room for users born in the same year.
- **Invitation Codes**: Users can generate codes to invite friends, expanding the community.
- **Fresh Conversations**: Only messages posted in the last 24 hours are visible, ensuring dynamic and timely discussions.
- **Time Capsules**: Users can send messages to their future selves, creating personal time capsules.
- **Token-Based Interaction**: Initial token balance is provided upon signup. Posting messages and creating capsules deduct tokens from this balance.
- **Business Sponsorships**: Rooms can feature sponsor ads, displayed briefly as users enter for the first time each session.
- **Admin Panel**: A dedicated interface for administrators, offering insights into application statistics and user and coupon management.
- **Responsive Design**: Ensures a seamless experience across various devices and screen sizes.

### Key Technologies

- **Node.js and Express.js**: At the heart of the backend is a RESTful API, crafted using Node.js for its event-driven, non-blocking I/O model, and Express.js for its minimalist web framework capabilities, facilitating rapid development of the server-side logic.
- **Mongoose**: Interaction with the MongoDB database is managed through Mongoose, an elegant MongoDB object modeling tool designed to work in an asynchronous environment, providing a straightforward, schema-based solution to model the application data.
- **MongoDB Atlas**: I've chosen MongoDB Atlas as the database platform for its fully managed cloud database service, offering high availability, global distribution, and powerful performance for the NoSQL database needs.
- **Socket.IO**: Real-time notifications and communication within the app are powered by Socket.IO, enabling instant messaging and updates across client and server, enhancing the user experience with live interaction capabilities.
- **Nginx**: Serving as a reverse proxy web server, Nginx enhances the application's performance and security, efficiently handling load balancing and SSL termination, ensuring a robust and secure connection for all users.
- **Docker**: Docker containers for both the Express and Socket.IO servers for consistency, scalability, and isolation in the deployment process.
- **Hostinger KVM2 VPS**: The application is hosted on a reliable Hostinger KVM2 VPS, providing a dedicated environment optimized for performance and scalability, ensuring that DobKonektor remains accessible and responsive.
- **SSL by Certbot**: SSL certificates managed by Certbot, offering top-notch encryption for user data and communications across the platform.
- **Domain**: Domain secured through Namecheap, ensuring a memorable and professional URL for easy access to DobKonektor.

## Links

- [Access DobKonektor](https://dobkonektor.com/)
- [My Personal Page](https://philippecharpentier.dev/)
- [My LinkedIn Page](https://www.linkedin.com/in/philippe-charpentier/)

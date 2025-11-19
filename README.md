# SmartMundoAPI

This repository contains the backend API for the SmartMundo project.

## Project Description

SmartMundo is a comprehensive platform designed to manage and monitor various aspects of a smart environment. This API serves as the central hub for data management, business logic, and communication with different components of the SmartMundo ecosystem.

## Technologies Used

*   **ASP.NET Core:** For building robust and scalable web APIs.
*   **Entity Framework Core:** For object-relational mapping (ORM) and database interactions.
*   **SQL Server:** As the primary database for storing application data.
*   **Swagger/OpenAPI:** For API documentation and testing.
*   **JWT (JSON Web Tokens):** For authentication and authorization.

## Features

*   **User Management:** Registration, login, and profile management.
*   **Device Management:** Registering, configuring, and monitoring smart devices.
*   **Sensor Data Collection:** Receiving and storing data from various sensors.
*   **Automation Rules:** Defining and executing automated actions based on sensor data.
*   **Notifications:** Sending alerts and notifications to users.
*   **Role-Based Access Control (RBAC):** Managing user permissions.

## Getting Started

### Prerequisites

*   .NET SDK (version 8.0 or later)
*   SQL Server (or a compatible database)
*   Visual Studio or Visual Studio Code (recommended IDE)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/SmartMundoAPI.git
    cd SmartMundoAPI
    ```

2.  **Configure the database connection string:**
    Open `appsettings.json` (and `appsettings.Development.json`) and update the `DefaultConnection` string to point to your SQL Server instance.

    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=your_server_name;Database=SmartMundoDB;User Id=your_username;Password=your_password;TrustServerCertificate=True;"
    }
    ```

3.  **Apply database migrations:**
    Open a terminal in the project root and run the following commands:

    ```bash
    dotnet ef database update
    ```

4.  **Run the application:**
    

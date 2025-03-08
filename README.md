# LangRoute

This is a robust and configurable LLM proxy server built with Node.js, Express, and PostgreSQL. 

An LLM Proxy is a service that sits between your application and the LLM provider's API. It intercepts the requests and responses, allowing for features like caching, rate limiting, and key management.

LangRoute has the following features:

**Key features:**

*   **Model Routing:** Direct requests to different LLM providers (currently OpenAI and Mistral AI) based on the requested model.
*   **Fallback:** Automatically switch to a backup provider if the primary provider fails, ensuring high availability.
*   **Authentication:** Secure access using virtual API keys, allowing you to manage and control access for different users/applications.
*   **Rate Limiting:** Implement per-user rate limiting based on both requests per minute and tokens per minute, preventing abuse and managing resource usage.
*   **Cost Tracking:** Calculate and track the cost of each request, providing insights into your LLM usage and expenses.
*   **Database Configuration:** Store all configurations (models, providers, user keys, rate limits) in a PostgreSQL database, making it easy to manage and update settings without modifying code.
*   **Extensible:** Designed to be easily extended to support additional LLM providers.
*   **Request and Response Standardization:** Supports OpenAI and Mistral AI providers, with requests and responses following the OpenAI format for consistency.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (version 16 or later recommended). Download from [https://nodejs.org/](https://nodejs.org/).
*   **npm:** (Node Package Manager) Usually comes bundled with Node.js.
*   **PostgreSQL:** You'll need a running PostgreSQL server. Download from [https://www.postgresql.org/download/](https://www.postgresql.org/download/). Follow the instructions for your OS.
*   **`psql`:** The PostgreSQL command-line client (usually installed with PostgreSQL).
*   **`openssl`:** For generating encryption keys (usually pre-installed on Linux/macOS; for Windows, it often comes with Git). Test with `openssl version`.
*   **`git`:** To clone the repository.
*   **`curl`:** For testing the API (or use Postman, Insomnia, etc.).

## Installation and setup

1.  **Clone the rrepository:**

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables (CRUCIAL):**

    You *must* set two environment variables for encryption: `ENCRYPTION_KEY` and `IV`. *Do not skip this*.

    *   **Generate random keys:** Use `openssl` to generate strong, random keys:

        ```bash
        export ENCRYPTION_KEY=$(openssl rand -hex 32)
        export IV=$(openssl rand -hex 16)
        ```

    *   **Verify:** IMMEDIATELY verify that the variables are set:

        ```bash
        echo $ENCRYPTION_KEY  # Should be 64 hex characters
        echo $IV             # Should be 32 hex characters
        ```

    *   **(.env file - DEVELOPMENT ONLY):** For *development only*, you can create a `.env` file in the project root:

        ```
        ENCRYPTION_KEY=your_64_char_hex_key_here
        IV=your_32_char_hex_iv_here
        ```

        Replace `your_64_char_hex_key` and `your_32_char_hex_iv` with *your* generated keys. If using a `.env` file, make sure the *first* line of `app.js` is `require('dotenv').config();` and that you've installed `dotenv` (`npm install dotenv`). **Never commit the .env file.**

    *   **Important:** For production, use your operating system or hosting provider's method for setting environment variables securely.

4.  **Set up PostgreSQL:**

    *   **Ensure PostgreSQL is running.**

    *   **Create database and user:** Connect to PostgreSQL as the `postgres` superuser (or another superuser):

        *   **Linux/macOS:** `sudo -u postgres psql`
        *   **Windows:** (Assuming `psql` is in your PATH) `psql -U postgres`

        Execute these SQL commands in `psql`:

        ```sql
        CREATE DATABASE langroute;
        CREATE USER langroute WITH PASSWORD 'langroute';  -- ***USE A STRONG PASSWORD IN PRODUCTION***
        GRANT ALL PRIVILEGES ON DATABASE langroute TO langroute;
        \q  -- Exit psql
        ```

        **SECURITY NOTE:** Using `langroute` for username, password, and database name is for *development convenience only*. *Never* do this in production.

5.  **Initialize sequelize:**

    ```bash
    npx sequelize-cli init
    node setup-config.js
    ```

    This creates the `config`, `models`, `migrations`, and `seeders` directories.

6.  **Configure sequelize (`config/config.json`):**

    *   Open `config/config.json`.
    *   Modify the `development`, `test` and `production` sections to match your PostgreSQL settings. Ensure `username`, `password`, `database`, `host`, and `dialect` are correct (values below are just examples). Add the `schema` option.
    ```json
    {
      "development": {
        "username": "langroute",
        "password": "langroute",
        "database": "langroute",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "schema": "public"
      },
      "test": {
        "username": "langroute",
        "password": "langroute",
        "database": "langroute_test",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "schema": "public"
      },
      "production": {
        "username": "langroute",
        "password": "langroute",
        "database": "langroute_prod",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "schema": "public"
      }
    }
    ```
    * Also, open models/index.js, and find this line:
    ```javascript
    const config = require(__dirname + '/../config.json')[env];
    ```
    And change it to:
    ```javascript
    const config = require(__dirname + '/../config.json')[env];
    ```

7.  **Create models and migrations:**
 
    Just in case, run these commands:
    
    ```bash
    npx sequelize-cli model:generate --name User --attributes virtualKey:string,openaiKey:string,mistralKey:string,requestsPerMinute:integer,tokensPerMinute:integer,totalCost:float
    npx sequelize-cli model:generate --name LLMModel --attributes name:string,provider:string,fallback:string,inputCostPer1k:float,outputCostPer1k:float
    npx sequelize-cli model:generate --name Provider --attributes name:string,apiBase:string,apiVersion:string
    ```

    *   **Modify the generated files:** Carefully replace the contents of the generated model files (`models/user.js`, `models/model.js`, `models/provider.js`) and the corresponding migration files in the `migrations/` directory with the code provided in the previous responses.  Pay close attention to:
        *   The `encryptKey` and `decryptKey` methods in `models/user.js`.
        *   The `fallback` field in `models/model.js` (and its getter/setter).
        *   The `tableName` option in each model to ensure the correct table names are used.

9.  **Run migrations:**

    ```bash
    npx sequelize-cli db:migrate
    ```

    This creates the tables.  Verify with `psql` and `\dt`.

10.  **Run seeders:**

    Run the following command to execute all seeders and populate the database with initial data:

    ```bash
    ./runseeders.sh
    ```

    This script will run all seeders using Sequelize CLI and populate your database with the necessary initial data.

## Running the application

```bash
export ENCRYPTION_KEY=$(openssl rand -hex 32)  # If NOT using .env
export IV=$(openssl rand -hex 16)          # If NOT using .env
node app.js
```

You should see "LLM proxy server listening on port 3000. Connected to PostgreSQL via Sequelize".

## Testing the API

Use curl (or Postman, Insomnia, etc.):

### 1. Generate a virtual key:

```bash
curl -X POST http://localhost:3000/api/generate-virtual-key
```

This returns a line similar to:

```
{ "virtualKey": "a1b2c3d4-e5f6-7890-1234-567890abcdef" }  
```

### 2. Save API Keys:

```
curl -X POST -H "Content-Type: application/json" -d '{
  "virtualKey": "YOUR_GENERATED_VIRTUAL_KEY",
  "openaiKey": "sk-your-test-openai-key",
  "mistralKey": "your-test-mistral-key"
}' http://localhost:3000/api/save-keys
```

Replace:

- YOUR_GENERATED_VIRTUAL_KEY with the key from step 1.
- sk-your-test-openai-key with a test OpenAI key (or "").
- your-test-mistral-key with a test Mistral key (or "").


### 3. Send a chat completion request:

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_VIRTUAL_KEY" -d '{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Translate the following English text to French: Hello, world!"
    }
  ]
}' http://localhost:3000/chat/completions
```

Replace: YOUR_VIRTUAL_KEY with your generated key.

### 4. Test fallback: 

Temporarily invalidate your OpenAI key in the database (using psql) and make another request. The proxy should fall back to Mistral. Then, restore your valid OpenAI key.

### 5. Test rate limiting:

- Requests Per Minute: Send more than 60 requests (or your configured lower limit for easy testing) within a minute. You should get `429 Too Many Requests` errors.
- Tokens Per Minute: Send requests with very long prompts to exceed the token limit within a minute.

### 6. Verify cost tracking: Connect to your database using psql and check the totalCost column in the Users table. It should be increasing:

```
psql -U langroute -d langroute -h localhost
SELECT * FROM "Users";
```

### 7. Test error handling (should return 401 Unauthorized):

Invalid virtual key:

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer invalid_key" -d '{"model": "gpt-3.5-turbo", "messages": []}' http://localhost:3000/chat/completions
```

Missing bearer: (Should return 401 Unauthorized)

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: your_virtual_key" -d '{"model": "gpt-3.5-turbo", "messages": []}' http://localhost:3000/chat/completions
```

Invalid model: (Should return 400 Bad Request)

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_VIRTUAL_KEY" -d '{"model": "invalid-model", "messages": []}' http://localhost:3000/chat/completions
```

## Limitations and roadmap

This setup is for development. For production:

- Never store API keys or encryption keys in your code or .env file in production. Use environment variables or a key management service.
- Use HTTPS.
- Implement proper input validation.
- Consider authentication/authorization for your API endpoints.
- Regularly update dependencies.

Potential improvements: 

- Error Handling: This is basic error handling. Needs improvement.
- Rate Limiting: This uses in-memory rate limiting. Redis should be considered for production.
- Database: The database setup creates a public schema.


# Chatbot Backend

This project is a backend implementation for a chatbot that provides location-based recommendations using the Naver Places and Directions APIs. The chatbot retrieves user location data, processes user queries, and returns relevant recommendations based on specified categories.

## Project Structure

```
chatbot-backend
├── app
│   ├── __init__.py          # Initializes the Flask application and sets up configurations and routes.
│   ├── routes.py            # Defines API endpoints for the chatbot.
│   ├── services              # Contains service modules for various functionalities.
│   │   ├── location.py      # Handles geolocation services.
│   │   ├── naver_api.py     # Interacts with the Naver Places API.
│   │   ├── directions.py     # Calculates distances and travel times.
│   │   └── session.py       # Manages user sessions.
│   └── utils                # Utility functions for the application.
│       └── parser.py        # Parses user input and extracts keywords.
├── tests                    # Contains unit tests for the application.
│   ├── test_routes.py       # Tests for the routes defined in routes.py.
│   └── test_services.py     # Tests for the service functions.
├── requirements.txt         # Lists project dependencies.
├── config.py                # Configuration settings for the Flask application.
└── README.md                # Documentation for the project.
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd chatbot-backend
   ```

2. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

3. **Configure the application:**
   - Update `config.py` with your API keys and other necessary configurations.

4. **Run the application:**
   ```
   python -m flask run
   ```

## Usage

- The chatbot can be accessed via the defined API endpoints in `routes.py`. 
- Users can send requests to the chatbot to receive location-based recommendations based on their current location and specified categories.

## Testing

- To run the tests, use the following command:
  ```
  pytest
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
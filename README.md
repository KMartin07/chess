# Chess Web Application

This is a simple yet functional web-based chess application that allows users to play against an AI (Stockfish) or another human player. The application features a clean interface and provides real-time game status updates.

## Features

*   **Play against AI:** Challenge a Stockfish chess engine.
*   **Two-Player Mode:** Play against a friend on the same board.
*   **AI Hints:** Get suggestions for optimal moves from the AI.
*   **Interactive Board:** Powered by `chessboard.js` for smooth piece movement.
*   **Real-time Status:** Displays current turn, check status, and game-over conditions (checkmate, draw).

## Technologies Used

*   **Backend:**
    *   Python 3
    *   Flask: Web framework for handling requests and serving the frontend.
    *   python-chess: Library for chess game logic and FEN manipulation.
    *   Stockfish: Powerful open-source chess engine integrated for AI moves and hints.
*   **Frontend:**
    *   HTML5
    *   CSS3 (Tailwind CSS for styling, custom CSS, and `chessboard.css`)
    *   JavaScript (jQuery, `chess.js` for client-side game logic, `chessboard.js` for board visualization).
*   **Deployment:**
    *   Docker: For containerizing the application, ensuring easy setup and portability.

## Setup and Running Locally

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   Docker (recommended for easy setup)
*   Python 3.x (if running without Docker)
*   Stockfish chess engine executable (if running without Docker, ensure it's in your system's PATH or specify its path in `app.py`)

### Using Docker (Recommended)

The easiest way to run this application is by using Docker.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/kmartin07/chess.git 
    cd chess
    ```
2.  **Build the Docker image:**
    ```sh
    docker build -t chess .
    ```
3.  **Run the Docker container:**
    This command will start the application and map port 8080 inside the container to port 80 on your host machine.
    ```sh
    docker run -d -p 80:8080 chess
    ```
4.  **Access the application:**
    Open your web browser and navigate to `http://localhost`.

### Running Without Docker 

If you prefer not to use Docker, you can run the application directly:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/kmartin07/chess.git 
    cd chess
    ```
2.  **Install Python dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
3.  **Ensure Stockfish is available:**
    Download the Stockfish executable for your operating system and place it in a location accessible by the `app.py` script, or ensure it's in your system's PATH. You might need to adjust the `engine = chess.engine.SimpleEngine.popen_uci('stockfish')` line in `app.py` if Stockfish is not in your PATH.
4.  **Run the Flask application:**
    ```sh
    python app.py
    ```
5.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.


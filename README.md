# Ping Pong Game

This project is a simple Ping Pong game, developed for the purpose of discovering, learning, and demonstrating my skills with Docker. The game itself is coded in HTML5 Canvas, CSS, and JavaScript, but the main goal was to manage its entire lifecycle with Docker: from image creation to deployment on a public registry.

## How to Play?

1.  Choose your game mode: "Play vs Computer" for single-player or "Play vs Friend" for two players.
2.  Enter player name(s).
3.  The game will start immediately.

### Controls
- **Player 1 (Left Paddle)**: Controls with the **Mouse**.
- **Player 2 (Right Paddle / PvP Mode)**: Controls with the **ArrowUp** and **ArrowDown** keys.
- **Computer (Right Paddle / PvC Mode)**: The computer controls this paddle automatically.

### Objective
- Be the first to score 5 points to win the match.
- After a game is over, click the mouse to play again.

---

## How to Run and Play the Game

Here are the different ways to access the game, from the simplest to the most advanced.

### Option 1: Play Online (via Docker Hub)

This is the easiest and fastest method. If you have Docker installed, you can play the game with a single command, without even needing to download the source code.

1. Open a terminal.
2. Run the following command:
   ```bash
   docker run -d -p 8080:80 danielou1/ping-pong-game:latest
   ```
   *This command downloads the game's image from Docker Hub and runs it in a container on your machine.*

3. Open your browser and go to: **[http://localhost:8080](http://localhost:8080)**

### Option 2: Build the Image from Source

If you have cloned this GitHub repository, you can build the Docker image yourself.

1. Navigate to the project folder in your terminal.
2. Build the image:
   ```bash
   docker build -t my-ping-pong .
   ```
3. Run a container from your newly built image:
   ```bash
   docker run -d -p 8080:80 my-ping-pong
   ```
4. Play at **[http://localhost:8080](http://localhost:8080)**.

### Option 3: Share on a Local Network

Once the container is running (using Option 1 or 2), you can make the game accessible to others on the same Wi-Fi network.

1. Find your local IP address (on Windows, use the `ipconfig` command in a terminal).
2. Ask the other person to open the address `http://YOUR_LOCAL_IP:8080` in their browser.

**Note:** You will likely need to configure your firewall to allow incoming connections on port `8080`.

### Option 4: Share Publicly over the Internet (for a Demo)

To temporarily share the game with anyone in the world, you can use `ngrok`.

1. Make sure the game container is running.
2. Launch `ngrok` to expose your port 8080:
   ```bash
   ngrok http 8080
   ```
3. Share the public URL (ending in `.ngrok.io`) that `ngrok` provides.# ping-pong-game_using_DOCKER

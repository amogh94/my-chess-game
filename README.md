# Chess Game

To play, clone or download this repository and open the index.html file in your browser.

The game is built using the following libraries:
- [chess.js](https://github.com/jhlywa/chess.js) for game state
- [chessboard.js](https://chessboardjs.com/index.html) for UI

This project is simply a usage of the above libaries and follows the approach explained in [this article](https://www.freecodecamp.org/news/simple-chess-ai-step-by-step-1d55a9266977/). Thanks to [MIT OpenCourseWare](https://www.youtube.com/watch?v=STjW3eH0Cik) for the theory.

## Contribution

The game is not yet intelligent and I welcome improvements on it. The challenge lies in implementing an [evaluation function](https://github.com/amogh94/my-chess-game/blob/master/js/game.js#L188) which, given the state of the board, returns a numeric measure of how favorable that state is to the AI.

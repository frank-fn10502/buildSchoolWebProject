function GuessNumberGame() {
    this.answer= '000';
    this.guess= '000';
    this.checkAnswer = function() {
        if (isNaN(this.guess) || this.guess == "") 
        {
            return undefined;
        }
        else 
        {
            let result = this.guess - this.answer;
            return (result == 0 ? 0 : (result > 0 ? 1 : -1));
        }
    }
}
export var guessNumberGame = new GuessNumberGame();
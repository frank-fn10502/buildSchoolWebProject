function GuessNumberGame() {
    this.gameStart = false;
    this.name = '猜數字';
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
function GuessNumberGame2() {
    this.gameStart = false;
    this.name = '1A2B';
    this.answer= '000';
    this.guess= '000';
    this.checkAnswer = function() {
        if(this.guess.length == 0) return undefined
        else if(this.answer.length != this.guess.length)
        {
            return -1;
        }
        else
        {
            let A = 0,B = 0;
            for(let i = 0 ; i < this.answer.length ; i++)
            {
                for(let j = 0 ; j < this.answer.length ; j++)
                {
                    if(this.answer[i] == this.guess[j])
                    {
                        if(i == j) A++;
                        else B++;
                    } 
                }
            }
            return `${A}A${B}B`;
        }
    }
}
export var guessNumberGame = new GuessNumberGame();
export var mastermindGame = new GuessNumberGame2();
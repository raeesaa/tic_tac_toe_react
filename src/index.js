import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={() => props.clickHandler()}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    let lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
            return squares[a];
        }
    }

    return null;

}


class Board extends React.Component {

    renderSquare(i) {
        return (<Square
            value={this.props.squares[i]}
            clickHandler={() => this.props.onClick(i)} />);
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            isXNext: true
        }
    }

    handleClick = (index) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = current.squares.slice();

        if (calculateWinner(current.squares)) {
            return;
        }

        if (this.state.isXNext) {
            squares[index] = 'X';
        } else {
            squares[index] = 'O';
        };

        this.setState((previousState) => ({
            history: history.concat([{ squares: squares }]),
            stepNumber: history.length,
            isXNext: !previousState.isXNext
        }));
    }

    jumpTo = (index) => {
        this.setState({
            stepNumber: index,
            isXNext: (index % 2) === 0
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Move # " + move : "Game start!";

            return <li key={move}><a href="#" onClick={() => this.jumpTo(move)}>{desc}</a></li>
        });

        let status = '';

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.isXNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board onClick={(i) => this.handleClick(i)} squares={current.squares} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

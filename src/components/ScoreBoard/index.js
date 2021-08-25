const Scoreboard = props => {
    const { scoreBoard, clearScoreBoard } = props;

   
    const mapScores = scores => {
        return scores.map((score, index) => {
            return (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-center h-7`}>
                    <td className="text-sm pl-3 text-left">{score.category}</td>
                    <td className="text-sm capitalize">{score.level}</td>
                    <td className="text-sm">{score.score}/{score.out_of}</td>
                </tr>
            )
        })
    }
    return (
        <div className="w-auto px-2 text-center md:px-4">
            <h3 className="font-bold underline mb-2">Your Scoreboard</h3>
            <table className="w-full table-fixed border-collapse border border-green-800">
                <thead>
                    <tr className="bg-indigo-100 h-8">
                        <th className="">Category</th>
                        <th className="">Difficulty</th>
                        <th className="">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {mapScores(scoreBoard)}
                </tbody>
            </table>
            {
                scoreBoard.length > 0 ? (
                    <button onClick={() => clearScoreBoard()} className="mt-2 py-1 px-2 text-sm font-semibold bg-gradient-to-tr from-red-400 to-red-800 rounded-md text-white">Clear board</button>
                ) : (
                    <p className="leading-loose my-2">No scores yet. Start playing...☝🏽</p>
                )
            }
        </div>
    );
}

export default Scoreboard;
const Scoreboard = props => {
    const { scoreBoard } = props;
    const mapScores = scores => {
        return scores.map((score, index) => {
            return (
                <tr key={index} className="text-center h-8">
                    <td className="pl-3 text-left">{score.category}</td>
                    <td className="capitalize">{score.level}</td>
                    <td>{score.score}/{score.out_of}</td>
                    {/* <td>{score.out_of}</td> */}
                </tr>
            )
        })
    }
    return (
        <div className="w-auto px-2 text-center px-5">
            <h3 className="font-bold underline mb-2">Your Scoreboard</h3>
            <table className="w-full table-fixed border-collapse border border-green-800">
            <thead>
                <tr className="bg-indigo-100 h-8">
                    <th className="">Category</th>
                    <th className="">Difficulty</th>
                    <th className="">Score</th>
                    {/* <th className="">Out Of</th> */}
                </tr>
            </thead>
            <tbody>
                {mapScores(scoreBoard)}
            </tbody>
        </table>
        </div>
    );
}

export default Scoreboard;
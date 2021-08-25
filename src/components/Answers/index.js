import { escapeHtml } from "../../utils/utilFunctions";

const Answers = (props) => {
    const { userAnswers, userScore, data, getQuestions } = props;


    const mapResults = (userAnswers) => {
        return userAnswers.map((ans, index) => {
            return <div key={index}
                className={`${ans == data[index].correct_answer ? "border-green-400" : "text-black"} py-3 px-1`}
            >

                <p className="font-bold leading-loose text-base mb-2">{escapeHtml(data[index].question)}</p>
                <p className={`${ans == data[index].correct_answer ? "text-green-500" : "text-red-500"} font-medium ml-1`}>Your answer: {escapeHtml(ans)}</p>
                {ans == data[index].correct_answer ?
                    " " : (
                        <p className="text-base font-medium ml-1">Correct answer: {escapeHtml(data[index].correct_answer)}</p>
                    )}

                <hr className="my-2" />
            </div>
        })
    }

    return (
        <div className="w-auto md:w-full flex-auto my-3 mx-1.5 py-6 px-5 md:mx-auto border-2 border-gray-400">
            <p className="font-bold text-xl">Final Score: {userScore} out of {data.length}</p>
            <hr />
            <div>{mapResults(userAnswers)}</div>
            <button className="bg-indigo-500 py-1 px-2 text-sm rounded-md w-20 text-white" onClick={() => getQuestions()}>Restart</button>
        </div>
    );
}

export default Answers;
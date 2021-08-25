import { escapeHtml, shuffleArray } from "../../utils/utilFunctions";

const QuestionCard = (props) => {
    const { question, currentIndex, data, answerChecked, handleAnswerRadio, selectedCategory, filterCategoryById } = props;

    const mapAnswers = answers => {
        return answers.map((answer, index) => {
            return (
                <div key={index} className="mx-2 mt-2">
                    <input type="radio" checked={answerChecked} onChange={(e) => handleAnswerRadio(e)} id={answer} name="answer" value={answer} className="appearance-none h-5 w-5 rounded-lg hover:h-6 hover:w-6 hover:border-2 hover:border-blue-600 " />
                    <label className="ml-2 text-lg font-medium " htmlFor="answer">{escapeHtml(answer)}</label>
                </div>
            )
        })
    }

    const renderQuestionCard = question => {
        return (
            <div className="w-auto flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">

                <p className="font-bold text-lg font-mono mt--1">{escapeHtml(question.question)}</p>
                <div className="mt-3">{mapAnswers(question.all_answers)}</div>
            </div>
        )
    }
    return (
        <div className="px-5 mt-4">
            <div className="flex flex-col mb-2">
                <p className="text-2xl font-bold text-indigo-600 text-center">{selectedCategory !== 0 ? filterCategoryById(selectedCategory) : "Random"}</p>
                <p className="text-xl text-indigo-500 font-bold text-center">{currentIndex + 1} / {data.length}</p>
            </div>
            {renderQuestionCard(question)}
        </div>
    );
}

export default QuestionCard;
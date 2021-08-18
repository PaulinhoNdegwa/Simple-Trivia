import axios from "axios";
import { Component } from "react";
import Loader from "../Loader";

class Main extends Component {
    state = {
        loading: false,
        data: [],
        currentIndex: 0,
        userAnswers: [],
        userScore: 0
    }

    componentDidMount() {
        this.getQuestions();
    }

    getQuestions = () => {
        this.setState({ loading: true, currentIndex: 0, userScore: 0, userAnswers: [] });
        axios.get("https://opentdb.com/api.php?amount=3")
            .then(res => {
                console.log(res.data);
                this.setState({ data: res.data.results, loading: false });
            })
            .catch(err => {
                console.log(err.request);
                this.setState({ loading: false });
            })
    }

    handleAnswerCheckbox = (e, index) => {
        const { currentIndex, userAnswers, data, userScore } = this.state;
        console.log(e.target.value);

        if (data[currentIndex].correct_answer == e.target.value) {
            console.log("Correct!!")
            this.setState({ userScore: userScore + 1 });
        }
        this.setState({ currentIndex: currentIndex + 1, userAnswers: [...userAnswers, e.target.value] })
    }

    mapAnswers = answers => {
        return answers.map((answer, index) => {
            return (
                <div key={index} className="mx-2 mt-2">
                    <input type="radio" className="h-4 w-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-600" onChange={(e) => this.handleAnswerCheckbox(e, index)} id={answer} name="answer" value={answer} />
                    <label className="ml-1  text-sm font-normal" htmlFor="answer">{this.escapeHtml(answer)}</label>
                </div>
            )
        })
    }

    escapeHtml = (text) => {
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&shy;/g, '-')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&Eacute;/g, 'É');
    }

    renderQuestionCard = question => {

        const allAnswers = [...question.incorrect_answers, question.correct_answer];
        return (
            <div>
                <div className="w-auto flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">
                    <p className="font-semibold leading-loose text-base">{this.escapeHtml(question.question)}</p>
                    <div className="mt-3">{this.mapAnswers(allAnswers)}</div>
                </div>
            </div>
        )
    }


    mapResults = (userAnswers) => {
        const { data } = this.state;
        return userAnswers.map((ans, index) => {
            return <li key={index}
                className={`${ans == data[index].correct_answer ? "text-green-400" : "text-black"} mt-3`}
            >{ans} ------ {data[index].correct_answer}</li>
        })
    }


    render() {
        const { loading, data, currentIndex, userScore, userAnswers } = this.state;
        const question = data[currentIndex];
        return (
            <div className="flex flex-col mb-3 sm:justify-center w-auto sm:w-auto md:w-2/3 lg:w-1/2  mx-auto px-4">
                {
                    loading ? (
                        <Loader />
                    ) : (currentIndex < data.length ? (
                        question ? (
                            <div>
                                {this.renderQuestionCard(question)}
                                <button className="bg-indigo-500 py-2 px-3 rounded-md w-24 text-white" onClick={() => this.getQuestions()}>Restart</button>
                            </div>


                        ) : null
                    ) : (
                        <div className="w-auto flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">
                            <p className="text-base">Your score is: {userScore} out of {data.length}</p>
                            <hr />
                            <ul>{this.mapResults(userAnswers)}</ul>
                        </div>
                    )
                    )
                }
            </div>
        );
    }
}

export default Main;
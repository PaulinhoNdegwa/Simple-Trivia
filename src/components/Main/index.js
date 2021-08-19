import axios from "axios";
import { Component } from "react";
import { escapeHtml, shuffleArray } from "../../utils/utilFunctions";
import Loader from "../Loader";

class Main extends Component {
    state = {
        loading: false,
        data: [],
        numberofQuestions: 10,
        categories: [],
        selectedCategory: 0,
        currentIndex: 0,
        userAnswers: [],
        userScore: 0,
        answerChecked: false
    }

    componentDidMount() {
        this.getCategories()
        this.getQuestions();
    }


    getCategories = () => {
        axios.get("https://opentdb.com/api_category.php")
            .then(res => {
                this.setState({ categories: res.data.trivia_categories });
            })
            .catch(err => {
                console.log(err.request);
            })
    }

    getQuestions = () => {
        this.setState({ loading: true, currentIndex: 0, userScore: 0, userAnswers: [] });
        const { selectedCategory, numberofQuestions } = this.state;

        let url = `https://opentdb.com/api.php?amount=${numberofQuestions}&difficulty=easy`;
        if (selectedCategory) {
            url = `https://opentdb.com/api.php?amount=${numberofQuestions}&difficulty=easy&category=${selectedCategory}`
        }

        axios.get(url)
            .then(res => {
                this.setState({ data: res.data.results, loading: false });
            })
            .catch(err => {
                console.log(err.request);
                this.setState({ loading: false });
            })
    }

    handleCategoryChange = e => {
        this.setState({ selectedCategory: parseInt(e.target.value) });

        setTimeout(() => {
            this.getQuestions();
        }, 1000);
    }

    handleAnswerRadio = (e) => {
        this.setState({ answerChecked: true })
        const { currentIndex, userAnswers, data, userScore } = this.state;

        if (data[currentIndex].correct_answer == e.target.value) {
            this.setState({ userScore: userScore + 1 });
        }
        this.setState({ currentIndex: currentIndex + 1, userAnswers: [...userAnswers, e.target.value], answerChecked: false })
    }

    mapAnswers = answers => {
        const { answerChecked } = this.state;
        return answers.map((answer, index) => {
            return (
                <div key={index} className="mx-2 mt-2">
                    <input type="radio" checked={answerChecked} onChange={(e) => this.handleAnswerRadio(e)} id={answer} name="answer" value={answer} className="h-5 w-5 rounded-lg hover:h-6 hover:w-6 hover:border-blue-500 hover:border-indigo-500 focus:outline-none hover:ring-1 hover:ring-indigo-600" />
                    <label className="ml-2 text-lg font-medium " htmlFor="answer">{escapeHtml(answer)}</label>
                </div>
            )
        })
    }

    filterCategoryById = id => {
        const { categories } = this.state;
        return categories.filter(cat => cat.id === id)[0].name;

    }

    mapCategories = categories => {
        return categories.map((category, index) => {
            return (
                <option key={index} value={category.id}>{category.name}</option>
            )
        })
    }

    renderQuestionCard = question => {
        const { currentIndex, data } = this.state;
        const allAnswers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(allAnswers);
        return (
            <div className="w-auto flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">
                <div className="flex mb-2 justify-center">
                    <p className="text-2xl text-blue-600 font-bold">{currentIndex + 1} / {data.length}</p>
                    <hr />
                </div>
                <p className="font-bold text-lg font-mono mt--1">{escapeHtml(question.question)}</p>
                <div className="mt-3">{this.mapAnswers(allAnswers)}</div>
            </div>
        )
    }


    mapResults = (userAnswers) => {
        const { data } = this.state;
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


    render() {
        const { loading, data, currentIndex, userScore, userAnswers, selectedCategory, categories } = this.state;
        const question = data[currentIndex];
        return (
            <div className="flex flex-col mb-3 sm:justify-center w-auto sm:w-auto md:w-2/3 lg:w-1/2  mx-auto px-4">
                <div className="flex flex-col sm:flex-row my-1 mx-1">
                    <div>
                        <label className="block text-base text-md text-gray-800 py-1" htmlFor="cat">Select Category:</label>
                        <select name="cat" id="cat" value={selectedCategory} onChange={this.handleCategoryChange} className="w-full md:w-60 h-9 py-1 bg-white border-1 border-gray-500 text-base rounded-lg focus:border-lg focus:border-indigo-500">
                            <option value={0}>Random</option>
                            {this.mapCategories(categories)}
                        </select>
                    </div>
                    <button className="bg-indigo-500 mt-1 md:h-9 md:mt-7 md:ml-4 py-1 px-3 rounded-md w-full sm:w-24 text-white font-semibold" onClick={() => this.getQuestions()}>Refresh</button>
                    <hr className="my-2" />
                </div>
                {
                    loading ? (
                        <Loader />
                    ) : (currentIndex < data.length ? (
                        question ? (
                            <div>
                                <p className="text-2xl font-bold text-indigo-600 ml-2">{selectedCategory !== 0 ? this.filterCategoryById(selectedCategory) : "Random"}</p>
                                {this.renderQuestionCard(question)}
                            </div>
                        ) : null
                    ) : (
                        <div className="w-full flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">
                            <p className="font-bold text-xl">Final Score: {userScore} out of {data.length}</p>
                            <hr />
                            <div>{this.mapResults(userAnswers)}</div>
                            <button className="bg-indigo-500 py-2 px-3 rounded-md w-24 text-white" onClick={() => this.getQuestions()}>Restart</button>
                        </div>
                    )
                    )
                }
            </div>
        );
    }
}

export default Main;
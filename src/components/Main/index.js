import axios from "axios";
import { Component } from "react";
import Loader from "../Loader";

class Main extends Component {
    state = {
        loading: false,
        data: [],
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
                console.log(res.data);
                this.setState({ categories: res.data.trivia_categories });
            })
            .catch(err => {
                console.log(err.request)
            })
    }

    getQuestions = () => {
        this.setState({ loading: true, currentIndex: 0, userScore: 0, userAnswers: [] });
        const { selectedCategory } = this.state;
        let url = "https://opentdb.com/api.php?amount=10&difficulty=easy";
        if (selectedCategory) {
            console.log("Selected category")
            url = `https://opentdb.com/api.php?amount=10&difficulty=easy&category=${selectedCategory}`
        }
        
        axios.get(url)
            .then(res => {
                console.log(res.data);
                this.setState({ data: res.data.results, loading: false });
            })
            .catch(err => {
                console.log(err.request);
                this.setState({ loading: false });
            })
    }

    handleCategoryChange = e => {
        console.log(e.target.value);
        this.setState({ selectedCategory: e.target.value });
    }

    handleAnswerRadio = (e) => {
        this.setState({ answerChecked: true })
        const { currentIndex, userAnswers, data, userScore } = this.state;

        if (data[currentIndex].correct_answer == e.target.value) {
            console.log("Correct!!")
            this.setState({ userScore: userScore + 1 });
        }
        this.setState({ currentIndex: currentIndex + 1, userAnswers: [...userAnswers, e.target.value], answerChecked: false })
    }

    mapAnswers = answers => {
        const { answerChecked } = this.state;
        return answers.map((answer, index) => {
            return (
                <div key={index} className="mx-2 mt-2">
                    <input type="radio" checked={answerChecked} onChange={(e) => this.handleAnswerRadio(e)} id={answer} name="answer" value={answer} className="h-4 w-4 rounded-lg hover:h-6 hover:w-6 hover:border-blue-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-600"  />
                    <label className="ml-1 text-base font-semibold text-gray-700" htmlFor="answer">{this.escapeHtml(answer)}</label>
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
            .replace(/&eacute;/g, 'É')
            .replace(/&ldquo;/g, '"');
    }

    mapCategories = categories => {
        return categories.map((category, index) => {
            return (
                <option key={index} value={category.id}>{category.name}</option>
            )
        })
    }

    renderQuestionCard = question => {

        const allAnswers = [...question.incorrect_answers, question.correct_answer];
        return (
            <div>
                <div className="w-auto flex-auto my-3 py-6 px-5 mx-auto border-2 border-gray-400">
                    <p className="font-bold leading-loose text-lg">{this.escapeHtml(question.question)}</p>
                    <div className="mt-3">{this.mapAnswers(allAnswers)}</div>
                </div>
            </div>
        )
    }


    mapResults = (userAnswers) => {
        const { data } = this.state;
        return userAnswers.map((ans, index) => {
            return <div key={index}
                className={`${ans == data[index].correct_answer ? "border-green-400" : "text-black"} mt-2 p-3`}
            >
                <p className="font-bold leading-loose text-base mb-2">{this.escapeHtml(data[index].question)}</p>
                <p className={`${ans == data[index].correct_answer ? "text-green-500" : "text-red-500"} font-semibold`}>Your answer: {this.escapeHtml(ans)}</p>
                <p className="text-base font-semibold">Correct answer: {this.escapeHtml(data[index].correct_answer)}</p>
                <hr className="mt-2" />
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
                        <label className="block text-sm text-md text-gray-500 py-1" htmlFor="cat">Select Category</label>
                        <select name="cat" id="cat" value={selectedCategory} onChange={this.handleCategoryChange} className="w-full h-9 py-1 bg-white border-2 border-gray-500 text-sm rounded-lg focus:border-lg focus:border-indigo-500">
                            {this.mapCategories(categories)}
                        </select>
                    </div>
                    <button className="bg-indigo-500 mt-1 md:h-9 md:mt-7 md:ml-4 py-1 px-3 rounded-md w-full sm:w-24 text-white font-semibold" onClick={() => this.getQuestions()}>Refresh</button>
                </div>
                {
                    loading ? (
                        <Loader />
                    ) : (currentIndex < data.length ? (
                        question ? (
                            <div>
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
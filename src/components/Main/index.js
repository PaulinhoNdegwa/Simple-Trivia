import axios from "axios";
import { Component } from "react";
import { shuffleArray } from "../../utils/utilFunctions";
import Answers from "../Answers";
import FilterForm from "../FiltersForm";
import Landing from "../Landing";
import Loader from "../Loader";
import QuestionCard from "../QuestionCard";
import Scoreboard from "../ScoreBoard";
class Main extends Component {
    state = {
        loading: false,
        data: [],
        numberofQuestions: 10,
        hideFilters: true,
        categories: [],
        selectedCategory: "",
        selectedLevel: "",
        currentIndex: 0,
        userAnswers: [],
        userScore: 0,
        answerChecked: false,
        scoreBoard: []
    }

    componentDidMount() {
        this.getCategories()
        // this.getQuestions();
        let scoreBoard = JSON.parse(localStorage.getItem("scoreboard"));
        if(!scoreBoard){
            localStorage.setItem("scoreboard", JSON.stringify([]));
            scoreBoard = [];

        }
        this.setState({ scoreBoard });

    }

    clearScoreBoard = () => {
        localStorage.setItem('scoreboard', JSON.stringify([]));
        this.setState({ scoreBoard: [] });
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

    nextQuestion = () => {
        const { currentIndex } = this.state;
        this.setState({ currentIndex: currentIndex + 1, answerChecked: false });
    }

    getQuestions = () => {
        this.setState({ loading: true, currentIndex: 0, userScore: 0, userAnswers: [] });
        const { selectedCategory, selectedLevel, numberofQuestions } = this.state;

        let url = `https://opentdb.com/api.php?amount=${numberofQuestions}&difficulty=easy`;
        if (selectedCategory && selectedLevel) {
            url = `https://opentdb.com/api.php?amount=${numberofQuestions}&difficulty=${selectedLevel}&category=${selectedCategory}`
        } else if(selectedLevel){
            url = `https://opentdb.com/api.php?amount=${numberofQuestions}&difficulty=${selectedLevel}`
        } else if(selectedCategory){
            url = `https://opentdb.com/api.php?amount=${numberofQuestions}&category=${selectedCategory}`
        }

        axios.get(url)
            .then(res => {
                this.setState({ data: res.data.results, loading: false, hideFilters: true });
            })
            .catch(err => {
                console.log(err.request);
                this.setState({ loading: false, hideFilters: true });
            })
    }

    handleCategoryChange = e => {
        this.setState({ selectedCategory: parseInt(e.target.value) });

        setTimeout(() => {
            this.getQuestions();
        }, 1000);
    }

    handleLevelChange = e => {
        this.setState({ selectedLevel: e.target.value });
    }

    handleAnswerRadio = (e) => {
        this.setState({ answerChecked: true })
        const { currentIndex, userAnswers, data, userScore } = this.state;

        if (data[currentIndex].correct_answer == e.target.value) {
            this.setState({ userScore: userScore + 1 });
        }
        this.setState({  userAnswers: [...userAnswers, e.target.value], currentIndex: currentIndex+1, answerChecked: false });

        const { selectedLevel, selectedCategory } = this.state;
        if(currentIndex - data.length === -1){
            const score = {
                score: data[currentIndex].correct_answer == e.target.value ? userScore + 1 : userScore,
                category: selectedCategory ? this.filterCategoryById(selectedCategory) : "Random",
                level: selectedLevel ? selectedLevel : "Random",
                out_of: data.length
            }
            let localscoreBoard = JSON.parse(localStorage.getItem("scoreboard"));
            localscoreBoard.unshift(score);
            this.setState({ scoreBoard: [ ...localscoreBoard ]});
            localStorage.setItem("scoreboard", JSON.stringify(localscoreBoard));
        }
    }

    filterCategoryById = id => {
        const { categories } = this.state;
        return categories.filter(cat => cat.id === id)[0].name;

    }

    render() {
        const { loading, data, currentIndex, userScore, userAnswers, answerChecked, selectedCategory, selectedLevel, categories, hideFilters, scoreBoard } = this.state;
        const question = data[currentIndex];

        if(question){
            const allAnswers = [...question.incorrect_answers, question.correct_answer];
            shuffleArray(allAnswers);
            question.all_answers = allAnswers;
        }
        return (
            <div className="flex flex-col mb-3 sm:justify-center w-auto sm:w-auto md:w-2/3 lg:w-1/2 mx-auto">
                <div className="flex flex-row-reverse">
                <button className={`mr-6 sm:ml-40 my-1 py-1 px-2 font-semibold border-2 border-indigo-500 rounded-md text-sm text-center w-28 h-8  ${hideFilters ? ` text-white bg-indigo-500` : `bg-white text-black `} `}
                    onClick={() => this.setState({ hideFilters: !hideFilters })}>
                    {hideFilters ? "Show Filters" : "Hide Filters"}
                </button>
                </div>
                <FilterForm 
                handleCategoryChange={this.handleCategoryChange}
                selectedCategory={selectedCategory}
                categories={categories}
                getQuestions={this.getQuestions}
                handleLevelChange={this.handleLevelChange}
                selectedLevel={selectedLevel}
                hideFilters={hideFilters}

                />
                <hr className="my-2" />
                {
                    
                    loading ? (
                        <Loader />
                    ) : ( data.length == 0  ||  selectedCategory === "")? (
                        <Landing />
                    ) : (
                        
                     (currentIndex < data.length ? (
                        question ? (
                           <QuestionCard question={question} currentIndex={currentIndex} data={data} answerChecked={answerChecked} handleAnswerRadio={this.handleAnswerRadio} selectedCategory={selectedCategory} filterCategoryById={this.filterCategoryById} />
                        ) : null
                    ) : (
                        <Answers userAnswers={userAnswers} userScore={userScore} data={data} getQuestions={this.getQuestions} />
                    ) )
                    )
                }
                <Scoreboard scoreBoard={scoreBoard} clearScoreBoard={this.clearScoreBoard} />
            </div>
        );
    }
}

export default Main;
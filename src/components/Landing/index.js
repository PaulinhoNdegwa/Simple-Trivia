const Landing = () => {
    return (
        <div className="border-2 w-auto mx-2 md:w-full h-60 text-center flex flex-col justify-center align-center bg-gradient-to-r from-yellow-200 via-red-400 to-indigo-500 text-black font-bold">
            <h2 className="text-2xl md:text-3xl leading-loose">Welcome to Simple Trivia</h2>
            <h4 className="text-lg md:text-xl font-medium">Select a category to get started</h4>
            <span className="text-2xl md:my-2 animate-bounce">📒</span>
        </div>
    );
}

export default Landing;
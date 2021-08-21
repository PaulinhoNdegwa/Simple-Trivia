const FilterForm = props => {
    const { handleCategoryChange, categories, selectedCategory, getQuestions, selectedLevel, handleLevelChange, hideFilters } = props;

    const levels = [ "easy", "medium", "hard" ]

    const mapCategories = categories => {
        return categories.map((category, index) => {
            return (
                <option key={index} value={category.id}>{category.name}</option>
            )
        })
    }

    const mapLevels = levels => {
        return levels.map((level, index) => {
            return (
                <option key={index} value={level}>{level}</option>
            )
        })
    }


    return ( 
        <form autoComplete="off" className={`${hideFilters ? `hidden` : ``} flex flex-col px-4 mb-2 sm:flex-row sm:flex-wrap sm:justify-evenly`}>
                <div className="flex-1 my-1 mx-1">
                        <label className="block text-sm text-gray-800 py-1" htmlFor="cat">Select Difficulty:</label>
                        <select name="difficulty" id="difficulty" value={selectedLevel} onChange={handleLevelChange} className="w-full md:w-65 h-8 py-1 bg-white border-1 border-gray-500 text-base rounded-lg focus:border-lg focus:border-indigo-500">
                            <option value={""}>All</option>
                            {mapLevels(levels)}
                        </select>
                </div>
                <div className="flex-1 my-1 mx-1">
                        <label className="block text-sm  text-gray-800 py-1" htmlFor="cat">Select Category:</label>
                        <select name="cat" id="cat" value={selectedCategory} onChange={handleCategoryChange} className="w-full md:w-65 h-8 py-1 bg-white border-1 border-gray-500 text-base rounded-lg focus:border-lg focus:border-indigo-500">
                            <option value={0}>Random</option>
                            {mapCategories(categories)}
                        </select>
                </div>
                <button className="bg-indigo-500 mt-1 sm:h-9 sm:mt-7 sm:ml-4 py-1 px-3 rounded-md w-full sm:w-24 text-white font-semibold" onClick={() => getQuestions()}>Refresh</button>
                <hr className="my-2" />
        </form>
     );
}
 
export default FilterForm;
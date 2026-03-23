
export default function Form() {
    return (
        <div className = "min-h-screen flex flex-col bg-white">
            <div className="pb-20 relative flex-grow">
                <section id="top-of-form"></section>

                <h1 className="text-4xl text-center"> Student Info Form</h1>

                <div className = "absolute inset-y-13 left-1/2 -translate-x-1/2 w-[700px] bg-gray-200 border-3 border-gray-400"></div>
                <div className="flex flex-col items-center relative z-10">                
                    {/* Entering school */}
                    <p className="text-2xl" style={{ padding: "1rem"}}> Enter Your School: </p>

                    <main style={{ padding: "1rem"}}>
                        <input className="border-2 border-black rounded"
                            name="school"
                            list = "schools"
                            placeholder= "School name"
                        />

                        <datalist id="schools">
                            <option value="Grossmont College"></option>
                            <option value="Cuyamaca College"></option>

                        </datalist>
                    </main>

                    {/* Entering major */}
                    <p className="text-2xl" style={{ padding: "1rem"}}> Enter Your Major:</p>

                    <main style={{ padding: "1rem"}}>
                        <input className="border-2 border-black rounded"
                            name="major"
                            list = "majors"
                            placeholder= "Major"
                        />

                        <datalist id="majors">
                            <option value="Computer Science"></option>
                            <option value="Biology"></option>
                            <option value="Business Administration"></option>
                            <option value="English - Single Subject Teaching"></option>
                            <option value="Economics"></option>
                            <option value="History"></option>
                            <option value="Liberal Studies Elementary Education"></option>
                            <option value="Mathematics"></option>
                            <option value="Political Science"></option>
                            <option value="Psychology"></option>
                        </datalist>
                    </main>

                    {/* Entering courses */}
                    <p className="text-2xl" style={{ padding: "1rem"}}> Enter Courses You Have Taken:</p>
                    <main style={{ padding: "1rem"}}>
                        <div className = "flex justify-center p-4">
                            <textarea className="border-2 border-black rounded" name="message" rows="5" cols="40" placeholder= "Ex. Math 150">
                            </textarea>
                        </div>
                        
                        <p className="text-2xl text-center p-4" style={{ padding: "1rem"}}> OR </p>

                        <label htmlFor="myfile">File must be .JSON type: </label>
                            <input className="border-2 border-black rounded" type="file" id="myfile" name="myfile"/>
                                <br /><br />
                    </main>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-12 relative z-10">
                    <a className="rounded-full bg-[#97da9bff] text-black text-2xl px-20 py-5 hover:bg-green-200">
                        Submit Form
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full h-11 bg-[#97da9bff] flex justify-center items-center relative border-2">
                    <a
                    href="#top-of-form"
                    className="rounded-full bg-black text-white px-5 py-1 hover:bg-gray-800"
                    >
                    Back To Top ↑
                    </a>
            </div>
        </div>
    );
}
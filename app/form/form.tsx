
export default function Form() {
    return (
        <div>  

            <h1 className="text-5xl" style={{ padding: "1rem"}}> Student Info Form </h1>
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
                <textarea className="border-2 border-black rounded" name="message" rows="5" cols="40">
                    Type in your courses here
                </textarea>
                
                <p className="text-2xl" style={{ padding: "1rem", textIndent: "130px"}}> OR </p>

                <label htmlfor="myfile">Select a .JSON file: </label>
                    <input className="border-2 border-black rounded" type="file" id="myfile" name="myfile"/>
                        <br /><br />

            </main>

            {/* Submit Button */}
            <button className="border-2 border-black rounded ml-35" style={{}} type="submit">Submit Form</button>


            
        </div>
        
    );
}
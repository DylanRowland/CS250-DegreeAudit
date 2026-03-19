
export default function Form() {
    return (
        <div>
            <h1 className="text-5xl"> Student Info Form </h1>
            <p className="text-2xl"> Enter Your School: </p>

            <main style={{ padding: "1rem"}}>
                <input
                    name="school"
                    list = "schools"
                    placeholder= "School name"
                />

                <datalist id="schools">
                    <option value="Grossmont College"></option>
                    <option value="Cuyamaca College"></option>

                </datalist>
            </main>

            <p className="text-2xl"> Enter Your Major:</p>

            <main style={{ padding: "1rem"}}>
                <input
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
        </div>
        
    );
}
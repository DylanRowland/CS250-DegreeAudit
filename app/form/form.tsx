
export default function Form() {
    return (
        <div>
            <h1 className="text-5xl"> Student Info Form </h1>
            <p className="text-2xl"> Enter Your School: </p>

            <main style={{ padding: "1rem"}}>
                {/* <label htmlFor="school">School</label> */}
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
        </div>
        
    );
}
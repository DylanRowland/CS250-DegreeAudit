
@app.get("/courses")
def get_courses(): 
    return {"courses": ["Course 1", "Course 2", "Course 3"]}

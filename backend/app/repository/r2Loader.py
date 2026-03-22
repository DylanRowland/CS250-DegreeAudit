import boto3
import json

def get_r2_client():
    s3 = boto3.client(
        service_name = 's3',
        endpoint_url = R2_URL,
        aws_access_key_id = ACCESS_KEY_ID,
        aws_secret_access_key = SECRET_KEY_ID,
        region_name = 'auto',  
    )
    return s3

def load_json_file(filename):
    s3 = get_r2_client()
    response = s3.get_object(Bucket = 'eagle-eyed-scholars', Key = filename)
    file_content = response['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    return json_content

def load_courses():
    courses_json = load_json_file('courses.json')
    return courses_json

def load_course_equivalencies():
    course_equivalencies_json = load_json_file('course_equivalencies.json')
    return course_equivalencies_json

def load_course_tags():
    course_tags_json = load_json_file('course_tags.json')
    return course_tags_json

def load_majors_programs():
    majors_programs_json = load_json_file('majors_programs.json')
    return majors_programs_json

def load_schools():
    schools_json = load_json_file('schools.json')
    return schools_json
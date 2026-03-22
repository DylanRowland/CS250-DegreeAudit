import boto3
import json

def get_r2_client():
    s3 = boto3.client(
        service_name = 's3',
        endpoint_url = R2_URL,
        aws_access_key_id = ACCESS_KEY_ID,
        aws_secret_key_id = SECRET_KEY_ID,
        region_name = 'auto',  
    )
    return s3

def load_json_file(filename):
    s3 = get_r2_client()
    response = s3.get_object(Bucket = 'eagle-eyed-scholars', key = filename)
    file_content = response['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    return json_content

def load_courses():
    courses_json = load_json_file('courses')
    return courses_json

def load_equivalencies():
    equivalencies_json = load_json_file('equivalencies')
    return equivalencies_json

def load_course_tags():
    course_tags_json = load_json_file('course_tags')
    return course_tags_json

def load_majors_programs():
    majors_programs_json = load_json_file('majors_programs')
    return majors_programs_json

def load_schools():
    schools_json = load_json_file('schools')
    return schools_json
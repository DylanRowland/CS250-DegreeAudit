import boto3
import json
from app.core.config import settings

def get_r2_client():
    s3 = boto3.client(
        service_name='s3',
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY,
        aws_secret_access_key=settings.R2_SECRET_KEY,
        region_name='auto',  
    )
    return s3

def load_json_file(filename):
    s3 = get_r2_client()
    response = s3.get_object(Bucket=settings.R2_BUCKET_NAME, Key=filename)
    file_content = response['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    return json_content

def load_courses():
    return load_json_file('courses.json')

def load_course_equivalencies():
    return load_json_file('course_equivalencies.json')

def load_course_tags():
    return load_json_file('course_tags.json')

def load_majors_programs():
    return load_json_file('majors_programs.json')

def load_schools():
    return load_json_file('schools.json')

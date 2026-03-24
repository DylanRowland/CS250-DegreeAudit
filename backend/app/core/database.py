import boto3
import json
from backend.app.core.config import settings

def get_R2_client():
    s3 = boto3.client("s3", endpoint_url = settings.R2_ENDPOINT_URL,
    aws_access_key_id = settings.R2_ACCESS_KEY,
    aws_secret_access_key = settings.R2_SECRET_KEY)
    return s3

def get_json_from_bucket(filename: str):
    client = get_R2_client()

    response = client.get_object(Bucket = settings.R2_BUCKET_NAME, Key = filename)

    response_body = json.loads(response["Body"].read().decode("utf-8"))

    return response_body

def put_json_in_bucket(filename: str, data: dict):
    client = get_R2_client()

    json_body = json.dumps(data)

    client.put_object(Bucket = settings.R2_BUCKET_NAME, Key = filename, Body = json_body)
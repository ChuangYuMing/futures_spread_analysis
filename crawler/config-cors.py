from google.cloud import storage


def cors_configuration(bucket_name):
    """Set a bucket's CORS policies configuration."""
    # bucket_name = "your-bucket-name"

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    bucket.cors = [
        {
            "origin": ["*"],
            "responseHeader": [
                "Content-Type",
                "x-goog-resumable"],
            "method": ['PUT', 'POST'],
            "maxAgeSeconds": 3600
        }
    ]
    bucket.patch()

    print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
    return bucket

cors_configuration('jamie_stock')
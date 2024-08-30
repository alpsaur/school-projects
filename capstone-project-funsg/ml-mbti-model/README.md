# MBTI Prediction API

This API predicts MBTI personality type based on input text.

## Example Usage

```python
import requests

url = "____"  # Replace with actual URL
api_key = "____"  # API key should be in "ML MBTI Plan"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": api_key
}
data = {
    "words": "adapt cook lead harmony grow"  # Send a POST request with a JSON body containing the "words" key
}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    result = response.json()
    print(f"Predicted MBTI: {result['predicted_mbti']}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)

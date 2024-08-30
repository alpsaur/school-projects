import os
import requests
import torch
from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, DistilBertConfig

app = Flask(__name__)

# Load your API key from an environment variable
API_KEY = os.environ.get('MBTI_API_KEY')

# Get the model filename from an environment variable
MODEL_FILENAME = os.environ.get('MBTI_MODEL_FILENAME')

if not MODEL_FILENAME:
    raise ValueError("MBTI_MODEL_FILENAME environment variable is not set.")

# Function to validate the API key
def validate_api_key(request):
    api_key = request.headers.get('X-API-Key')
    if not api_key or api_key != API_KEY:
        return False
    return True

# Download the model file if it doesn't exist
if not os.path.exists(MODEL_FILENAME):
    model_url = os.environ.get('MODEL_URL')
    if model_url:
        print(f"Downloading model file: {MODEL_FILENAME}")
        response = requests.get(model_url)
        with open(MODEL_FILENAME, 'wb') as f:
            f.write(response.content)
        print("Model file downloaded.")
    else:
        raise ValueError("MODEL_URL environment variable is not set.")

# Load the tokenizer
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

# Define the configuration to match your pre-trained model
config = DistilBertConfig.from_pretrained("distilbert-base-uncased", num_labels=16)

# Load the model with the specific configuration
model = DistilBertForSequenceClassification(config)

# Load the state dictionary (weights only) from the downloaded file
state_dict = torch.load(MODEL_FILENAME, map_location=torch.device('cpu'))

# Load the state dictionary into the model
model.load_state_dict(state_dict)
model.eval()

# List of 16 MBTI types
mbti_types = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
            'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

# Map index to MBTI type
index_to_mbti = {i: mbti for i, mbti in enumerate(mbti_types)}

def predict_mbti(words):
    inputs = tokenizer(words, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
    predicted_index = torch.argmax(probabilities).item()
    predicted_mbti = index_to_mbti[predicted_index]
    
    return predicted_mbti, probabilities[0].tolist()

@app.route('/predict', methods=['POST'])
def predict():
    # Validate API key
    if not validate_api_key(request):
        return jsonify({'error': 'Invalid API key'}), 401

    data = request.json
    words = data.get('words', '')
    
    if not words:
        return jsonify({'error': 'No words provided'}), 400
    
    predicted_mbti = predict_mbti(words)
    
    return jsonify({
        'predicted_mbti': predicted_mbti
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

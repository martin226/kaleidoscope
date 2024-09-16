from models.irony import predict_irony
from models.emotion import predict_emotion
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/predict/irony', methods=['POST'])
def predict_irony_route():
    data = request.get_json(force=True)
    prediction = predict_irony(data['text'], temperature=1.393)
    return jsonify(prediction)


@app.route('/predict/emotion', methods=['POST'])
def predict_emotion_route():
    data = request.get_json(force=True)
    prediction = predict_emotion(data['text'], temperature=1.006)
    return jsonify(prediction)


@app.route('/predict/all', methods=['POST'])
def predict_all_route():
    data = request.get_json(force=True)
    irony_prediction = predict_irony(data['text'], temperature=1.393)
    emotion_prediction = predict_emotion(data['text'], temperature=1.006)
    return jsonify({
        "irony": irony_prediction,
        "emotion": emotion_prediction
    })


if __name__ == '__main__':
    app.run(debug=True)

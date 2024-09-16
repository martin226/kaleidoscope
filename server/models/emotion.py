from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification, AutoConfig)
import torch

path = "models/emotion"

config = AutoConfig.from_pretrained(path)
tokenizer = AutoTokenizer.from_pretrained(path)
model = AutoModelForSequenceClassification.from_pretrained(path, config=config)


def predict_emotion(text, temperature=1.0):
    with torch.no_grad():
        encodings = tokenizer(text, truncation=True,
                              max_length=512, return_tensors="pt")
        logits = model(**encodings).logits
        logits = logits / temperature
        preds = logits.sigmoid().tolist()[0]
        result = []
        for i, pred in enumerate(preds):
            result.append({
                "label": model.config.id2label[i],
                "score": pred
            })
        result = sorted(result, key=lambda x: x['score'], reverse=True)
        return result

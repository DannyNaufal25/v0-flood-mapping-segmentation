# Flood Segmentation AI

Platform web untuk segmentasi gambar banjir menggunakan Deep Learning dengan dua arsitektur model:
- **U-Net** (Baseline)
- **U-Net + MobileNetV2** (Advanced)

## Fitur

- 🖼️ Upload dan analisis gambar banjir
- 🤖 Pilihan 2 model AI (U-Net & U-Net + MobileNetV2)
- 📊 Metrik performa lengkap (IoU, Dice, Pixel Accuracy)
- 💾 Download hasil segmentasi dan mask
- 🎨 UI modern dan responsif

## Teknologi

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend API**: Next.js Route Handlers
- **AI Models**: TensorFlow/Keras (Python)

## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend (Python)

Untuk menghubungkan dengan model TensorFlow dari file Python Anda:

1. **Buat Flask/FastAPI Backend**

```python
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load models
model_unet = tf.keras.models.load_model('unet_flood_final.keras')
model_unet_mnv2 = tf.keras.models.load_model('unet_mnv2_final.keras')

@app.route('/api/segment', methods=['POST'])
def segment():
    data = request.json
    image_data = data['image']
    model_type = data['model']
    
    # Decode base64 image
    image_bytes = base64.b64decode(image_data.split(',')[1])
    image = Image.open(io.BytesIO(image_bytes))
    
    # Preprocess
    image = image.resize((256, 256))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, 0)
    
    # Select model
    model = model_unet if model_type == 'unet' else model_unet_mnv2
    
    # Predict
    prediction = model.predict(img_array)
    mask = (prediction[0] > 0.5).astype(np.uint8) * 255
    
    # Convert to base64
    # ... (encode mask and segmented image)
    
    return jsonify({
        'segmentedImage': '...',
        'maskImage': '...',
        'metrics': {...}
    })

if __name__ == '__main__':
    app.run(port=5000)
```

2. **Update Frontend API URL**

Edit `app/api/segment/route.ts` untuk memanggil backend Python:

```typescript
const response = await fetch('http://localhost:5000/api/segment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image, model })
})
```

## Deployment

- **Frontend**: Deploy ke Vercel
- **Backend**: Deploy ke Railway, Render, atau Google Cloud Run

## Model Files

Pastikan file model ada di backend Python:
- `unet_flood_final.keras`
- `unet_mnv2_final.keras`

## Lisensi

MIT

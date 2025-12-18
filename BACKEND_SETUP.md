# Setup Backend Python untuk Flood Segmentation

## Langkah-langkah Setup

### 1. Persiapkan Model
Pastikan Anda memiliki file model yang sudah dilatih:
- `unet_flood_final.keras` (model U-Net)
- `unet_mnv2_final.keras` (model U-Net + MobileNetV2)

### 2. Install Dependencies
```bash
pip install flask flask-cors tensorflow pillow numpy opencv-python
```

### 3. Jalankan Backend

#### Opsi A: Lokal
```bash
python scripts/flask_backend_example.py
```

#### Opsi B: Dengan Cloudflare Tunnel (untuk akses eksternal)
```bash
# Terminal 1: Jalankan Flask
python scripts/flask_backend_example.py

# Terminal 2: Jalankan Cloudflare Tunnel
cloudflared tunnel --url http://localhost:5000
```

Cloudflare akan memberikan URL seperti:
`https://composed-levels-prepaid-robust.trycloudflare.com`

### 4. Update URL di Frontend
Jika URL backend Anda berbeda, update di `app/api/segment/route.ts`:
```typescript
const PYTHON_BACKEND_URL = "https://your-cloudflare-url.trycloudflare.com"
```

## Format API

### Endpoint: POST /predict

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "model": "unet" // atau "unet_mobilenet"
}
```

**Response:**
```json
{
  "segmented_image": "base64_encoded_overlay_image",
  "mask_image": "base64_encoded_binary_mask",
  "metrics": {
    "iou": 0.85,
    "dice": 0.90,
    "pixel_accuracy": 0.92
  },
  "processing_time": 1.2,
  "model_used": "unet"
}
```

## Troubleshooting

### Error 500: Internal Server Error
- Pastikan model file (.keras) ada di folder yang sama dengan script
- Cek log di terminal Flask untuk detail error
- Pastikan TensorFlow terinstall dengan benar

### Error 404: Not Found
- Pastikan endpoint `/predict` tersedia
- Cek apakah Flask sudah running dengan mengakses `http://localhost:5000/health`

### CORS Error
- Library `flask-cors` sudah diaktifkan dalam script
- Jika masih error, pastikan tidak ada proxy/firewall yang memblokir

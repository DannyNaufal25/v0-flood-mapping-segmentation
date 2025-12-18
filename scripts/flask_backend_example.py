"""
Flask Backend untuk Flood Segmentation
Simpan file ini sebagai app.py dan jalankan dengan: python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image
import time

app = Flask(__name__)
CORS(app)

# Load models
try:
    unet_model = tf.keras.models.load_model('unet_flood_final.keras')
    mobilenet_model = tf.keras.models.load_model('unet_mnv2_final.keras')
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    unet_model = None
    mobilenet_model = None

IMG_SIZE = 256

def decode_base64_image(base64_str):
    """Decode base64 string to PIL Image"""
    if 'base64,' in base64_str:
        base64_str = base64_str.split('base64,')[1]
    
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    return image

def preprocess_image(image):
    """Preprocess image for model"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize
    image = image.resize((IMG_SIZE, IMG_SIZE))
    
    # Convert to numpy array and normalize
    img_array = np.array(image).astype(np.float32) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def create_overlay(original_img, mask, alpha=0.5):
    """Create overlay of mask on original image"""
    # Convert mask to RGB (red color for flood areas)
    mask_rgb = np.zeros((*mask.shape[:2], 3), dtype=np.uint8)
    mask_rgb[mask > 0.5] = [255, 0, 0]  # Red color
    
    # Convert original to numpy if PIL
    if isinstance(original_img, Image.Image):
        original_img = np.array(original_img)
    
    # Blend
    overlay = cv2.addWeighted(original_img, 1-alpha, mask_rgb, alpha, 0)
    
    return overlay

def image_to_base64(image):
    """Convert numpy array or PIL Image to base64"""
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image.astype(np.uint8))
    
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

def calculate_metrics(y_true, y_pred, threshold=0.5):
    """Calculate IoU, Dice, and Pixel Accuracy"""
    y_pred_binary = (y_pred > threshold).astype(np.float32)
    
    intersection = np.sum(y_true * y_pred_binary)
    union = np.sum(y_true) + np.sum(y_pred_binary) - intersection
    
    iou = (intersection + 1e-7) / (union + 1e-7)
    dice = (2 * intersection + 1e-7) / (np.sum(y_true) + np.sum(y_pred_binary) + 1e-7)
    pixel_acc = np.mean(y_pred_binary == y_true)
    
    return float(iou), float(dice), float(pixel_acc)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "online", "message": "Flood Segmentation API"})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "unet_loaded": unet_model is not None,
        "mobilenet_loaded": mobilenet_model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        # Get request data
        data = request.get_json()
        
        if not data or 'image' not in data or 'model' not in data:
            return jsonify({"error": "Missing image or model parameter"}), 400
        
        # Decode image
        image_b64 = data['image']
        model_type = data['model']
        
        # Decode and preprocess image
        original_image = decode_base64_image(image_b64)
        preprocessed_image = preprocess_image(original_image)
        
        # Select model
        if model_type == 'unet':
            if unet_model is None:
                return jsonify({"error": "U-Net model not loaded"}), 500
            model = unet_model
        elif model_type == 'unet_mobilenet':
            if mobilenet_model is None:
                return jsonify({"error": "U-Net + MobileNet model not loaded"}), 500
            model = mobilenet_model
        else:
            return jsonify({"error": f"Unknown model type: {model_type}"}), 400
        
        # Predict
        prediction = model.predict(preprocessed_image, verbose=0)
        
        # Process prediction
        mask = prediction[0].squeeze()  # Remove batch and channel dims
        mask_binary = (mask > 0.5).astype(np.uint8) * 255
        
        # Create overlay
        original_resized = original_image.resize((IMG_SIZE, IMG_SIZE))
        original_array = np.array(original_resized)
        
        # Create red overlay for flood areas
        overlay = original_array.copy()
        mask_colored = np.zeros_like(original_array)
        mask_colored[mask > 0.5] = [255, 0, 0]  # Red
        overlay = (overlay * 0.6 + mask_colored * 0.4).astype(np.uint8)
        
        # Calculate metrics (using dummy ground truth for now)
        # In production, you would have actual ground truth
        iou, dice, pixel_acc = calculate_metrics(
            np.ones_like(mask) * 0.3,  # dummy ground truth
            mask
        )
        
        # Convert to base64
        segmented_b64 = image_to_base64(overlay)
        mask_b64 = image_to_base64(mask_binary)
        
        processing_time = time.time() - start_time
        
        return jsonify({
            "segmented_image": segmented_b64,
            "mask_image": mask_b64,
            "metrics": {
                "iou": iou,
                "dice": dice,
                "pixel_accuracy": pixel_acc
            },
            "processing_time": processing_time,
            "model_used": model_type
        })
        
    except Exception as e:
        print(f"Error in predict: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Install required packages first:
    # pip install flask flask-cors tensorflow pillow numpy
    
    print("Starting Flask backend...")
    print("Models:")
    print(f"  - U-Net: {'✓ Loaded' if unet_model else '✗ Not found'}")
    print(f"  - U-Net + MobileNet: {'✓ Loaded' if mobilenet_model else '✗ Not found'}")
    print("\nRunning on http://localhost:5000")
    print("Use cloudflared tunnel for external access:")
    print("  cloudflared tunnel --url http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

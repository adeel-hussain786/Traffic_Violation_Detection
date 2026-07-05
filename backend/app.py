from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io, os
from fastapi import WebSocket
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# ------------------------------------------
# Convert YOLO outputs to JSON-safe format
# ------------------------------------------
def parse_yolo(img, results):
    h, w = img.size[1], img.size[0]
    detections = []

    for r in results:
        for box, conf, cls in zip(
            r.boxes.xyxy.cpu().numpy(),      # numpy array
            r.boxes.conf.cpu().numpy(),      # numpy.float32
            r.boxes.cls.cpu().numpy().astype(int)
        ):
            x1, y1, x2, y2 = box

            detections.append({
                "label": r.names[int(cls)],
                "conf": float(conf),          # convert numpy.float32 → float
                "box": [
                    float(x1 / w),
                    float(y1 / h),
                    float(x2 / w),
                    float(y2 / h),
                ],
            })

    return detections


# ============================
#       IMAGE DETECTION
# ============================
@app.post("/detect-image")
async def detect_image(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    results = model.predict(np.array(img), imgsz=640, conf=0.3)
    detections = parse_yolo(img, results)

    return {
        "success": True,
        "detections": detections
    }


# ============================
#       VIDEO DETECTION
# ============================
@app.websocket("/ws-video")
async def ws_video(websocket: WebSocket):
    await websocket.accept()

    # Receive initial command or video bytes
    data = await websocket.receive_bytes()
    temp_path = "temp_stream_video.mp4"
    with open(temp_path, "wb") as f:
        f.write(data)

    cap = cv2.VideoCapture(temp_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    duration = total_frames / fps

    CHUNK_SECONDS = 1
    paused = False

    async def wait_until_resume():
        """Wait until frontend sends 'resume'"""
        nonlocal paused
        while paused:
            msg = await websocket.receive_text()
            if msg == "resume":
                paused = False

    try:
        num_chunks = int(duration // CHUNK_SECONDS) + 1

        for i in range(num_chunks):
            # WAIT WHILE PAUSED
            if paused:
                await wait_until_resume()

            # Get pause/resume commands
            try:
                msg = await websocket.receive_text(timeout=0.01)
                if msg == "pause":
                    paused = True
                    continue
                elif msg == "resume":
                    paused = False
            except:
                pass

            target_sec = i * CHUNK_SECONDS
            target_frame = int(target_sec * fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
            ret, frame = cap.read()
            if not ret:
                continue

            h, w = frame.shape[:2]
            results = model.predict(frame, imgsz=640, conf=0.3)

            detections = []
            for r in results:
                for box, conf, cls in zip(
                    r.boxes.xyxy.cpu().numpy(),
                    r.boxes.conf.cpu().numpy(),
                    r.boxes.cls.cpu().numpy().astype(int),
                ):
                    x1, y1, x2, y2 = box
                    detections.append({
                        "label": r.names[int(cls)],
                        "conf": float(conf),
                        "box": [
                            float(x1 / w),
                            float(y1 / h),
                            float(x2 / w),
                            float(y2 / h),
                        ],
                    })

            # SEND ONLY DETECTIONS (NOT FRAME)
            await websocket.send_json({
                "detections": detections,
                "time": target_sec
            })

    finally:
        cap.release()
        os.remove(temp_path)
        await websocket.close()

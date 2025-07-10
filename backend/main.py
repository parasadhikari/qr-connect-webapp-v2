from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from io import BytesIO
import qrcode
from PIL import Image
from pyzbar.pyzbar import decode

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-qr/")
async def generate_qr(url: str = Form(...)):
    img = qrcode.make(url)
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

@app.post("/scan-qr/")
async def scan_qr(file: UploadFile = File(...)):
    img = Image.open(BytesIO(await file.read()))
    decoded_data = decode(img)
    if decoded_data:
        return {"data": decoded_data[0].data.decode()}
    return JSONResponse(content={"error": "No QR code found"}, status_code=400)

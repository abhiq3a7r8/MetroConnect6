import cv2
import numpy as np
import streamlit as st
from pyzbar.pyzbar import decode

st.set_page_config(page_title="Metro Ticket Validator", layout="centered")

st.title("🎫 Metro Ticket QR Validator")

VALID_TICKET_ID = "MT20250402"

FRAME_WINDOW = st.image([])
cap = None

def scan_qr_code():
    global cap
    cap = cv2.VideoCapture(0, cv2.CAP_V4L2)

    if not cap.isOpened():
        st.error("🚨 Could not open the webcam.")
        return

    st.info("📸 Scanning... Please show the QR code.")

    while True:
        ret, frame = cap.read()
        if not ret:
            st.error("⚠️ Error reading from webcam")
            break

        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        decoded_objects = decode(frame_rgb)

        validation_result = "🔍 Scanning..."
        color = (255, 255, 255)
        background_color = "white"

        for obj in decoded_objects:
            qr_data = obj.data.decode("utf-8")

            if VALID_TICKET_ID in qr_data:
                validation_result = "✅ Valid Ticket"
                color = (0, 100, 0)
                background_color = "white"
            else:
                validation_result = "❌ Invalid Ticket"
                color = (255, 0, 0)
                background_color = "white"

            points = obj.polygon
            if len(points) == 4:
                pts = np.array(points, dtype=np.int32)
                cv2.polylines(frame, [pts], True, color, 2)

            cv2.putText(frame, validation_result, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

            st.success(validation_result)
            st.markdown(f"<div style='background-color:{background_color};padding:10px;border-radius:10px;'>"
                        f"<h3>📜 Ticket Details:</h3><p>{qr_data}</p></div>", 
                        unsafe_allow_html=True)

        FRAME_WINDOW.image(frame, channels="BGR")

        if decoded_objects:
            break  

    cap.release()
    cap = None

if st.button("Start Scanning"):
    if cap is None:
        scan_qr_code()

if st.button("Exit"):
    if cap:
        cap.release()
        cap = None
    st.warning("📴 Camera stopped. Refresh the page to scan again.")
    st.stop()

import streamlit as st
import requests
import pandas as pd
from datetime import datetime
from PIL import Image
import random

# --- Backend URL ---
BASE_URL = "http://localhost:8080/api"

# --- Streamlit Setup ---
st.set_page_config(page_title="SmartDrive - Car Rental Platform", page_icon="🚗", layout="wide")

# --- Custom CSS ---

st.markdown("""
<style>
div[role="radiogroup"] > label {
    font-size: 18px;
    padding: 8px 20px;
    border-radius: 8px;
    transition: 0.3s;
}

/* Active selected tab */
div[role="radiogroup"] input:checked + div {
    background-color: #00c8ff;
    color: black !important;
    border-radius: 8px;
    padding: 8px 20px;
}

/* Hover effect */
div[role="radiogroup"] label:hover {
    background-color: #1f2937;
    cursor: pointer;
}
div[role="radiogroup"] > label {
    font-size: 18px;
    padding: 10px 20px;
}
.big-title {
    font-size: 45px;
    font-weight: bold;
}
.sub-text {
    font-size: 20px;
    color: #bbbbbb;
}
.card {
    background-color: #1e1e2f;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.metric-number {
    font-size: 35px;
    font-weight: bold;
    color: #00c8ff;
}
</style>
""", unsafe_allow_html=True)



menu = ["🏠 Home", "🚘 View Cars", "➕ Add Car", "📅 Book Car", "📋 View Bookings","📊 Car History"]

if "menu" not in st.session_state:
    st.session_state["menu"] = "🏠 Home"

# Sticky Header Container
st.markdown("""
<style>
.navbar {
    position: sticky;
    top: 0;
    background-color: #0e1117;
    padding: 10px 0px;
    z-index: 999;
    border-bottom: 1px solid #333;
}
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="navbar">', unsafe_allow_html=True)

selected = st.radio(
    "",
    menu,
    horizontal=True,
    index=menu.index(st.session_state["menu"])
)

if selected != st.session_state["menu"]:
    st.session_state["menu"] = selected
    st.rerun()

choice = st.session_state["menu"]


# ---------------------------------------------------
# HOME PAGE
# ---------------------------------------------------
if choice == "🏠 Home":
    try:
        cars = requests.get(f"{BASE_URL}/cars").json()
    except:
        cars = []

    # Hero Section
    st.markdown(
    "<h1 style='font-size:60px;'>🚗 Smart Car Rentals</h1>",
    unsafe_allow_html=True
)

    st.markdown(
    "<h2 style='font-size:30px; color:gray;'>Rent Cars Easily & Quickly</h2>",
    unsafe_allow_html=True
)


    st.write(" ")
    st.markdown(
    "<p style='font-size:20px;'>✔ Browse cars</p>",
    unsafe_allow_html=True
)
    st.markdown(
    "<p style='font-size:20px;'>✔ Book instantly</p>",
    unsafe_allow_html=True
)

    st.markdown(
    "<p style='font-size:20px;'>✔ Manage bookings online</p>",
    unsafe_allow_html=True
)
    st.markdown(
    "<p style='font-size:20px;'>✔ Enjoy smooth and fast rentals without visiting offices.</p>",
    unsafe_allow_html=True
)

    st.write(" ")
    st.write(" ")
    st.write(" ")

    # Stats Section
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("""
        <div class="card">
            <div class="metric-number">{}</div>
            Cars Available
        </div>
        """.format(len(cars)), unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="card">
            <div class="metric-number">10+</div>
            Cities Covered
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div class="card">
            <div class="metric-number">500+</div>
            Happy Customers
        </div>
        """, unsafe_allow_html=True)

    st.write(" ")
    st.write(" ")

    # CTA Button
    if st.button("🚘 View Cars"):
        st.session_state["menu"] = "🚘 View Cars"
        st.rerun()


# ---------------------------------------------------
# VIEW CARS
# ---------------------------------------------------
elif choice == "🚘 View Cars":
    st.header("🚘 Available Cars")

    try:
        response = requests.get(f"{BASE_URL}/cars")

        if response.status_code == 200:
            cars = response.json()

            if cars:
                cols = st.columns(3)

                car_images = {
                    "SUV": "assets/cars/suv.jpg",
                    "Sedan": "assets/cars/sedan.jpg",
                    "Electric": "assets/cars/electric.jpg",
                    "Convertible": "assets/cars/convertible.jpg",
                    "Hatchback": "assets/cars/hatchback.jpg",
                }

                for i, car in enumerate(cars):
                    with cols[i % 3]:
                        st.image(car_images.get(car["type"], "assets/cars/sedan.jpg"), use_container_width=True)

                        st.markdown(f"""
                        <div class="car-card">
                            <h3>{car['company']} {car['name']}</h3>
                            <p><b>Type:</b> {car['type']}</p>
                            <p><b>Seats:</b> {car['seats']}</p>
                            <p><b>Price:</b> ₹{car['price']} per day</p>
                            <p class='rating'>⭐ {car['rating']}/5</p>
                        </div>
                        """, unsafe_allow_html=True)

                        if st.button(f"Book {car['name']}", key=i):

                          # Store selected car in session
                          st.session_state["selected_car"] = car

                          # Change menu to Book Car
                          st.session_state["menu"] = "📅 Book Car"

                          # Rerun app to navigate
                          st.rerun()


            else:
                st.warning("No cars available.")

        else:
            st.error("Failed to fetch cars.")

    except Exception as e:
        st.error(f"Error connecting to backend: {e}")

# ---------------------------------------------------
# ADD CAR
# ---------------------------------------------------
elif choice == "➕ Add Car":
    st.header("➕ Add a New Car")

    with st.form("add_car_form"):
        name = st.text_input("Car Name")
        company = st.text_input("Company")
        type_ = st.selectbox("Car Type", ["Select Type","Sedan", "SUV", "Hatchback", "Convertible", "Electric"])
        seats = st.number_input("Seats", min_value=2, max_value=10)
        price = st.number_input("Price per day (₹)", min_value=100.0)
        rating = st.slider("Rating", 0.0, 5.0, 4.5)
        
        if type_ == "Select Type":
          st.warning("Please select car type.")
        submitted = st.form_submit_button("Add Car")

    if submitted:

     errors = []

     if not name.strip():
        errors.append("Enter car name")

     if not company.strip():
        errors.append("Enter company name")

     if type_ == "Select Type":
        errors.append("Select car type")

     if seats <= 0:
        errors.append("Seats must be greater than 0")

     if price <= 0:
        errors.append("Price must be greater than 0")

     if errors:
        st.error("Please check the following:\n\n- " + "\n- ".join(errors))
        st.stop()

     # If all validations pass
     car_data = {
        "name": name,
        "company": company,
        "type": type_,
        "seats": seats,
        "price": price,
        "rating": rating
     }

     try:
        res = requests.post(f"{BASE_URL}/cars/add", json=car_data)

        if res.status_code in [200, 201]:
            st.success("🚗 Car added successfully!")
        else:
            st.error("Failed to add car.")
            st.write(res.text)

     except Exception as e:
        st.error(f"Error: {e}")

# ---------------------------------------------------
# BOOK CAR
# ---------------------------------------------------
elif choice == "📅 Book Car":
    st.header("📅 Book Your Car")

    selected_car = st.session_state.get("selected_car", None)

    try:
        cars = requests.get(f"{BASE_URL}/cars").json()
    except:
        cars = []

    car_list = [f"{c['company']} {c['name']}" for c in cars]

   # Check if user clicked Book from View Cars
    selected_car = st.session_state.get("selected_car", None)

    # Add placeholder option
    car_list_with_placeholder = ["Select Car"] + car_list

    default_index = 0

    if selected_car:
      selected_name = f"{selected_car['company']} {selected_car['name']}"
      if selected_name in car_list:
        default_index = car_list_with_placeholder.index(selected_name)

    car_selected = st.selectbox(
    "Select Car",
    car_list_with_placeholder,
    index=default_index
)


    # User Inputs
    user_name = st.text_input("Your Name")
    pickup_location = st.text_input("Pickup Location")
    pick_date = st.date_input("Pickup Date")
    return_date = st.date_input("Return Date")

    # Confirm Booking
    if st.button("Confirm Booking"):

    # --- VALIDATIONS ---

      if car_selected == "Select Car":
        st.error("Please select a car.")
        st.stop()

      if not user_name.strip():
        st.error("Please enter your name.")
        st.stop()

      if not pickup_location.strip():
        st.error("Please enter pickup location.")
        st.stop()

      if return_date <= pick_date:
        st.error("Return date must be after pickup date.")
        st.stop()

    # --- IF ALL VALID ---
      car_obj = next(c for c in cars if f"{c['company']} {c['name']}" == car_selected)

      booking = {
        "pickUpTime": datetime.combine(pick_date, datetime.min.time()).isoformat(),
        "returnUpTime": datetime.combine(return_date, datetime.min.time()).isoformat(),
        "pickupLocation": pickup_location,
        "carName": car_obj["name"],
        "carCompany": car_obj["company"],
        "carPrice": car_obj["price"],
        "carRating": car_obj["rating"],
        "carType": car_obj["type"],
        "seats": car_obj["seats"],
        "carOwner": car_obj["company"],
        "carUser": user_name,
        "isBooked": True
     }

      try:
         res = requests.post(f"{BASE_URL}/booking/car", json=booking)

         if res.status_code in [200, 201]:
            final_price = (return_date - pick_date).days * car_obj["price"]
            st.success(f"🎉 Booking Successful! Final price: ₹{final_price}")
            st.session_state.pop("selected_car", None)
         else:
            st.error(f"Booking failed. Status: {res.status_code}")
            st.write(res.text)

      except Exception as e:
        st.error(f"Error: {e}")
      if return_date <= pick_date:
        st.error("Return date must be after pickup date.")
        st.stop()

# ---------------------------------------------------
# VIEW BOOKINGS
# ---------------------------------------------------
elif choice == "📋 View Bookings":
    st.header("📋 All Bookings")

    try:
        res = requests.get(f"{BASE_URL}/booking/orders")

        if res.status_code == 200:
            data = res.json()

            if data:
                for order in data:
                 st.markdown("---")
                 st.markdown(f"""
                 ### 🚗 {order['carCompany']} {order['carName']}
                👤 User: {order['carUser']}  
                📍 Pickup: {order['pickupLocation']}  
                📅 From: {order['pickUpTime']}  
                📅 To: {order['returnUpTime']}
                """)
            else:
                st.info("No bookings yet.")

        else:
            st.error("Failed to fetch bookings.")

    except Exception as e:
        st.error(f"Backend error: {e}")
elif choice == "📊 Car History":

    st.header("📊 Car Rental History")

    try:
        cars = requests.get(f"{BASE_URL}/cars").json()
    except:
        cars = []

    car_names = [c["name"] for c in cars]

    selected_car = st.selectbox("Select Car", car_names)

    if st.button("Check History"):

        res = requests.get(f"{BASE_URL}/booking/history/{selected_car}")

        if res.status_code == 200:

            data = res.json()

        col1, col2, col3 = st.columns(3)

        # Show raw data
        # st.write(data)

        # Total bookings
        col1.metric("Total Bookings", len(data)) 

        # Calculate total rental days
        total_days = 0
        revenue = 0
        last_booked = "No bookings"

        if len(data) > 0:

            for booking in data:
                pickup = pd.to_datetime(booking["pickUpTime"])
                drop = pd.to_datetime(booking["returnUpTime"])

                days = (drop - pickup).days
                if days == 0:
                    days = 1

                total_days += days
                revenue += days * booking["carPrice"]

            last_booked = data[-1]["pickUpTime"]

        # Metrics
        col2.metric("Total Days", total_days)
        col3.metric("Revenue ₹", revenue)

        # Last booking date
        st.info(f"Last Booked: {last_booked}")

        # Show previous rentals
        st.subheader("Previous Rentals")

        if len(data) > 0:
            df = pd.DataFrame(data)
            st.dataframe(df)
        else:
            st.warning("No history found.")
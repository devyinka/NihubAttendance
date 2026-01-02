# 📱 Smart QR Attendance & Event Management System

> A comprehensive full-stack solution for managing event logistics, recurring attendance, and role-based administration using the MERN Stack.

## 📖 Project Overview

This application streamlines the entire flow of event management, from user registration to automated reporting. It solves the problem of manual attendance tracking by generating permanent QR codes for students and using smart logic to automate absentee marking.

---

## 🚀 Key Features

### 🎟️ Student Registration & QR System

- **Multi-Event Support:** Students can register for multiple events but are strictly limited to one "track" per event to prevent scheduling conflicts.
- **Automated QR Generation:** Upon successful registration, the system generates a **permanent QR Code**. Students use this single code to mark attendance for the duration of the event (whether it spans months or years).

### 🛡️ Secure Admin Hierarchy (RBAC)

- **Role-Based Access Control:**
  - **Super Admins:** Have full control to create events, tracks, and manage Sub-Admins.
  - **Sub-Admins:** Restricted strictly to operational tasks like scanning QR codes for attendance.
- **Security:** Super Admin registration is protected by a verification loop requiring external confirmation via a secure message sent to the company email/hub.

### ⚙️ Event Control & Visibility

- **Dynamic Dashboard:** Admins can "Open" or "Close" events. Closed events are instantly hidden from the user dashboard, preventing unauthorized or late registrations.

### 🧠 Smart Attendance Logic

I engineered a custom algorithm to handle daily tracking efficiently:

1.  **Automated Absenteeism:** If _at least one_ student is marked present in a track, the system assumes class held and automatically marks all other students in that track as **"Absent"** for the day.
2.  **False Negative Prevention:** If _zero_ attendance is marked (e.g., weekends, holidays, or cancelled classes), the system ignores that day entirely, ensuring students aren't penalized for administrative days off.

### 📊 Dynamic Reporting

- **One-Click Reports:** Admins can download detailed attendance logs at any time.
- The system compiles data automatically from the **Event Start Date** up to the **Current Download Date**.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Tools:** QR Code API, Nodemailer (for verification), JWT (Authentication)

---

## 👤 Author

**Salam Sodiq (DevYinka)**

- Twitter: [@devyinka](https://twitter.com/devyinka)
- GitHub: [@devyinka](https://github.com/devyinka)
- LinkedIn: [Salam Sodiq](https://linkedin.com/in/your-url-here)
-

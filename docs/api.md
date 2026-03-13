# API Documentation

This document defines all API request and response contracts used by the frontend.
All APIs are RESTful and return JSON.

This file is the single source of truth for API usage on the frontend.

---

## General Conventions

Base URL:
/api/v1

Common Success Response:
{
  "data": any,
  "message": string,
  "status": "SUCCESS"
}

Common Error Response:
{
  "message": string,
  "status": "ERROR"
}

---

## Entity: Certificate

Description:
Certificate represents an exam or qualification certificate (e.g. TOEIC, IELTS).

Fields:
- id (number): Unique identifier
- code (string): Certificate code
- name (string): Certificate name
- description (string): Certificate description
- status (number): Status (1 = Active, 0 = Inactive)

---

Get All Certificates
GET /certificates/get-all?page=1&limit=20

Query Parameters:
- page (number): Page number
- limit (number): Number of items per page


Response:
{
    "data": {
        "pagination": {
            "page": 1,
            "limit": 20,
            "total_records": 6,
            "total_pages": 1,
            "has_next": false,
            "has_prev": false
        },
        "response": [
            {
                "id": 1,
                "code": "TOEIC_LR",
                "name": "TOEIC Reading & Listening",
                "description": "Chứng chỉ TOEIC 2 kỹ năng",
                "status": 1
            },
            {
                "id": 2,
                "code": "IELTS_AC",
                "name": "IELTS Academic",
                "description": "Chứng chỉ IELTS Học thuật",
                "status": 1
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Get Certificate Detail (Edit)
GET /certificates/edit/{id}

Path Parameter:
- id (number): Certificate ID

Response:
{
  "data": {
    "id": 1,
    "code": "TOEIC_WS",
    "name": "TOEIC Writing & Speaking",
    "description": "Chứng chỉ TOEIC 2 kỹ năng",
    "status": 1
  },
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Create Certificate
POST /certificates/create

Request:
{
  "code": "abc1",
  "name": "xyz1",
  "description": "321"
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Update Certificate
PUT /certificates/update

Request:
{
  "id": 3,
  "code": "TOEIC_WS",
  "name": "TOEIC Writing & Speaking",
  "description": "Chứng chỉ TOEIC 2 kỹ năng"
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

UI Mapping:
- status = 1 → Active (Green tag)
- status = 0 → Inactive (Red tag)

---

Validation Rules:
- code: required, unique
- name: required
- description: optional

---

## Entity: Skill

Description:
Skill represents an exam (e.g. TOEIC, IELTS).

Fields:
- id (number): Unique identifier
- cert_id (number): Id Certificate
- code (string): Skill code
- name (string): Skill name
- order_index (number): Order index
- status (number): Status (1 = Active, 0 = Inactive)

---

Get All Skills

GET /skills/get-all?page=1&limit=20

Query Parameters:
- page (number): Page number
- limit (number): Number of items per page


Response:
{
    "data": {
        "pagination": {
            "page": 1,
            "limit": 20,
            "total_records": 2,
            "total_pages": 1,
            "has_next": false,
            "has_prev": false
        },
        "response": [
            {
                "id": 1,
                "cert_id": 1,
                "code": "LISTENING",
                "name": "Listening Test",
                "order_index": 1,
                "status": 1
            },
            {
                "id": 2,
                "cert_id": 1,
                "code": "READING",
                "name": "Reading Test",
                "order_index": 2,
                "status": 1
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Get Skill Detail (Edit)
GET /skills/edit/{id}

Path Parameter:
- id (number): Skill ID

Response:
{
    "data": {
        "id": 1,
        "cert_id": 1,
        "code": "LISTENING",
        "name": "Listening Test",
        "order_index": 1,
        "status": 1
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Create Skill
POST /skills/create

Request:
{
    "cert_id":1,
    "code":"WRITING",
    "name":"Writing Test",
    "order_index": 3
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Update Skill
PUT /skills/update

Request:
{
    "id": 3,
    "cert_id": 1,
    "code":"WRITING",
    "name":"Writing Test",
    "order_index": 3
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

UI Mapping:
- status = 1 → Active (Green tag)
- status = 0 → Inactive (Red tag)

---

Validation Rules:
- cert_id: required,
- code: required, unique
- name: required
- order_index: required
- status: optional

---

API Usage Rules (Frontend):
- Always create TypeScript interfaces for API responses
- Do NOT use any
- Do NOT assume pagination unless explicitly documented
- Do NOT invent or infer missing fields
- Map API models directly to UI models unless transformation is required

---

<!-- Notes:
- All endpoints require authentication
- Validation errors return HTTP 400
- Unauthorized access returns HTTP 401
- Forbidden access returns HTTP 403 -->

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

## Entity: Part Master

Description:
Part Master represents an skill (e.g. TOEIC, IELTS).

Fields:
- id (number): Unique identifier
- skill_id (number): Skill Id
- part_number (number): Part number
- name (string): Part name
- status (number): Status (1 = Active, 0 = Inactive)

---

Get All Part Master

GET /part-masters/get-all?page=1&limit=20

Query Parameters:
- page (number): Page number
- limit (number): Number of items per page

Response:
{
    "data": {
        "pagination": {
            "page": 1,
            "limit": 10,
            "total_records": 9,
            "total_pages": 1,
            "has_next": false,
            "has_prev": false
        },
        "response": [
            {
                "id": 1,
                "skill_id": 1,
                "part_number": 1,
                "name": "Photographs",
                "status": 1
            },
            {
                "id": 2,
                "skill_id": 1,
                "part_number": 2,
                "name": "Question-Response",
                "status": 1
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Get Part Master Detail (Edit)
GET /part-masters/edit/{id}

Path Parameter:
- id (number): Part Master ID

Response:
{
    "data": {
        "id": 1,
        "skill_id": 1,
        "part_number": 1,
        "name": "Photographs2",
        "status": 1
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Create Part Master
POST /part-masters/create

Request:
{
    "skill_id": 1,
    "part_number": 8,
    "name": "Photographs"
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Update Part Master
PUT /part-masters/update

Request:
{
    "id": 1,
    "skill_id": 1,
    "part_number": 1,
    "name": "Photographs",
    "status": 1
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
- skill_id: required,
- part_number: required
- name: required
- status: optional

---


## Entity: Exam

Description:
Exam represents an test (e.g. TOEIC, IELTS).

Fields:
- id (number): Unique identifier
- cert_id (number): Id Certificate
- title (string): Exam title
- year: Exam year
- category: Exam category
- total_time: Exam total time
- total_question: Exam total question
- description: Exam description
- thumbnail: Exam thumbnail
- audio_full_url: Exam audio full url
- created_at: Exam created at
- status (number): Status (1 = Active, 0 = Inactive)

---

Get All Exams

GET /exams/get-all?page=1&limit=20

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
                "title": "ETS 2024 - TEST 01",
                "year": 2024,
                "category": null,
                "total_time": 120,
                "total_question": 200,
                "description": null,
                "thumbnail": null,
                "audio_full_url": "https://cdn.xoailac.top/ets/audio/2024/01/output.m3u8",
                "status": 1,
                "created_at": "2025-12-21T16:37:07Z"
            },
            {
                "id": 5,
                "cert_id": 1,
                "title": "ETS 2024 - TEST 03",
                "year": 2024,
                "category": null,
                "total_time": 120,
                "total_question": 200,
                "description": null,
                "thumbnail": null,
                "audio_full_url": null,
                "status": 1,
                "created_at": "2026-03-11T08:09:22Z"
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Get Exam Detail (Edit)
GET /exams/edit/{id}

Path Parameter:
- id (number): Exam ID

Response:
{
    "data": {
        "id": 5,
        "cert_id": 1,
        "title": "ETS 2024 - TEST 03",
        "year": 2024,
        "category": null,
        "total_time": 120,
        "total_question": 200,
        "description": null,
        "thumbnail": null,
        "audio_full_url": null,
        "status": 1,
        "created_at": "2026-03-11T08:09:22Z"
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}

---

Create Exam
POST /exams/create

Request:
{
    "cert_id":1,
    "title":"ETS 2024 - TEST 02",
    "year":2024,
    "catagory":null,
    "description":null,
    "thumbnail":null,
    "total_question": 200,
    "total_time": 120,
    "audio_full_url": "https://cdn.xoailac.top/ets/audio/2024/01/output.m3u8",
    "status": 1
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Update Exam
PUT /exams/update

Request:
{
    "id": 5,
    "cert_id": 1,
    "title":"ETS 2024 - TEST 03",
    "year":2024,
    "total_question": 200,
    "total_time": 120,
    "status": 1
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
- title: required
- year: required
- total_time: required
- total_question: required
- audio_full_url: optional
- description: optional
- thumbnail: optional
- category: optional
- status: optional

---

API Usage Rules (Frontend):
- Always create TypeScript interfaces for API responses
- Do NOT use any
- Do NOT assume pagination unless explicitly documented
- Do NOT invent or infer missing fields
- Map API models directly to UI models unless transformation is required

---

## Entity: Question

Description:
Question represents an question (e.g. TOEIC, IELTS).

Fields:
- exam_id (number): Exam Id
- entity_type (string): Entity type (SINGLE),
- part_id (number): Part Id
- part (number): Part number,
- question_text (string): Question text
- image_url (string): Image url
- correct_answer (string): Correct answer
- option_a (string): Option A
- option_b (string): Option B
- option_c (string): Option C
- option_d (string): Option D
- audio_start_ms (number): Audio start ms
- audio_end_ms (number): Audio end ms
- sub_order (number): Sub order

---

Create Question Single

POST /questions/single/create

Request:
{
    "exam_id": 2,
    "entity_type": "SINGLE",
    "part_id": 1,
    "part": 1,
    "question_text": "abc",
    "image_url": "http://",
    "correct_answer":"A",
    "option_a": "AA",
    "option_b": "BB",
    "option_c": "CC",
    "option_d": "DD",
    "audio_start_ms": 1000,
    "audio_end_ms": 2000,
    "sub_order": 1
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Validation Rules:
- exam_id: required,
- entity_type: required,
- part_id: required,
- part: required,
- question_text: optional,
- image_url: optional,
- correct_answer: required,
- option_a: required,
- option_b: required,
- option_c: required,
- option_d: optional,
- audio_start_ms: optional,
- audio_end_ms: optional,
- sub_order: required


Create Question Group

POST /questions/group/create

Request:
{
    "exam_id": 2,
    "entity_type": "GROUP",
    "part_id": 1,
    "image_url":"http://group",
    "audio_start_ms": 1000,
    "audio_end_ms": 5000,
    "sub_questions": [
        {
            "part": 3,
            "question_text": "abc",
            "image_url":"http://question1"
            "correct_answer":"A",
            "option_a": "AA",
            "option_b": "BB",
            "option_c": "CC",
            "option_d": "DD",
            "sub_order": 1
        },
        {
            "part": 3,
            "question_text": "abc",
            "image_url":"http://question2"
            "correct_answer":"A",
            "option_a": "AA",
            "option_b": "BB",
            "option_c": "CC",
            "option_d": "DD",
            "sub_order": 2
        },
        {
            "part": 3,
            "question_text": "abc",
            "image_url": "http://question3",
            "correct_answer":"A",
            "option_a": "AA",
            "option_b": "BB",
            "option_c": "CC",
            "option_d": "DD",
            "sub_order": 3
        }
    ]
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

Validation Rules:
- exam_id: required,
- entity_type: required,
- part_id: required,
- part: required,
- question_text: optional,
- image_url: optional,
- correct_answer: required,
- option_a: required,
- option_b: required,
- option_c: required,
- option_d: optional,
- audio_start_ms: optional,
- audio_end_ms: optional,
- sub_order: required

---
<!-- Notes:
- All endpoints require authentication
- Validation errors return HTTP 400
- Unauthorized access returns HTTP 401
- Forbidden access returns HTTP 403 -->

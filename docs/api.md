# API Documentation

This document defines all API request and response contracts used by the frontend.
All APIs are RESTful and return JSON.

This file is the single source of truth for API usage on the frontend.

---

## General Conventions

Base URL:
/api/v1

Common Success Response:
```json
{
  "data": any,
  "message": string,
  "status": "SUCCESS"
}
```
Common Error Response:
```json
{
  "message": string,
  "status": "ERROR"
}
```
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
GET /certificates/get-all

Query Parameters:
- page (number): Page number
- limit (number): Number of items per page


Response:
```json
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
                "id": 0,
                "code": "string",
                "name": "string",
                "description": "string",
                "status": 0
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```
---

Get Certificate Detail (Edit)
GET /certificates/edit/{id}

Path Parameter:
- id (number): Certificate ID

Response:
```json
{
  "data": {
    "id": 1,
    "code": "string",
    "name": "string",
    "description": "string",
    "status": 1
  },
  "message": "Successfully.",
  "status": "SUCCESS"
}
```
---

Create Certificate
POST /certificates/create

Request:
```json
{
  "code": "string",
  "name": "string",
  "description": "string"
}
```

Response:
```json
{
  "message": "Successfully.",
  "status": "SUCCESS"
}
```
---

Update Certificate
PUT /certificates/update

Request:
```json
{
  "id": 0,
  "code": "string",
  "name": "string",
  "description": "string"
}
```
Response:
```json
{
  "message": "Successfully.",
  "status": "SUCCESS"
}
```
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

GET /skills/get-all

Query Parameters:
- page (number): Page number
- limit (number): Number of items per page


Response:
```json
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
                "id": 0,
                "cert_id": 0,
                "code": "string",
                "name": "string",
                "order_index": 0,
                "status": 0
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```

---

Get Skill Detail (Edit)
GET /skills/edit/{id}

Path Parameter:
- id (number): Skill ID

Response:
```json
{
    "data": {
        "id": 0,
        "cert_id": 0,
        "code": "string",
        "name": "string",
        "order_index": 0,
        "status": 0
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```

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

## Entity: Exam Structure

Description:
This API retrieves the structure of a specific exam, including its skills and parts.

**GET** `/exams/{exam_id}/structure`

**Path Parameters:**
- `exam_id` (number): The ID of the exam.

**Response:**
```json
{
    "data": {
        "exam_id": 1,
        "exam_name": "ETS 2024 - TEST 01",
        "cert_code": "TOEIC_LR",
        "blueprint": [
            {
                "skill_id": 1,
                "skill_code": "LISTENING",
                "skill_name": "Listening Test",
                "parts": [
                    {
                        "part_id": 8,
                        "part_name": "General Introduction",
                        "part_number": 0
                    }
                ]
            },
            {
                "skill_id": 2,
                "skill_code": "READING",
                "skill_name": "Reading Test",
                "parts": [
                    {
                        "part_id": 9,
                        "part_name": "General Reading Introduction",
                        "part_number": 0
                    }
                ]
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```

---

## Get Questions By Part Id

Description:
This API retrieves all questions associated with a specific part of an exam.

**GET** `/exams/{exam_id}/parts/{part_id}`

**Path Parameters:**
- `exam_id` (number): The ID of the exam.
- `part_id` (number): The ID of the part.

**Response:**
```json
{
    "data": {
        "exam_id": 1,
        "part_id": 1,
        "direction": {
            "text": "string",
            "audio_start_ms": 31000,
            "audio_end_ms": 60000,
            "example": {
                "explanation": "string",
                "image_url": "string",
                "correct_option": "C",
                "audio_start_ms": 60000,
                "audio_end_ms": 95000
            }
        }
        "items": [
            {
                "entity_type": "SINGLE",
                "entity_id": 1,
                "order_index": 1,
                "question_data": {
                    "question_id": 1,
                    "question_text": null,
                    "image_url": "https://cdn.xoailac.top/ets/image/2024/01/part1-1.png",
                    "audio_start_ms": 98000,
                    "audio_end_ms": 120000,
                    "correct_answer": "A",
                    "display_number": 1,
                    "sub_order": 1,
                    "explanation": null,
                    "transcript": null,
                    "options": {
                        "A": null,
                        "B": null,
                        "C": null,
                        "D": null
                    }
                }
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```

```json
{
    "data": {
        "exam_id": 1,
        "part_id": 3,
         "direction": {
            "text": "string",
            "audio_start_ms": 0,
            "audio_end_ms": 0
        }
        "items": [
            {
                "entity_type": "GROUP",
                "entity_id": 1,
                "order_index": 32,
                "group_data": {
                    "passage_text": null,
                    "image_url": null,
                    "audio_start_ms": 846000,
                    "audio_end_ms": 914000,
                    "transcript": null,
                    "explanation": null,
                    "sub_questions": [
                        {
                            "question_id": 10,
                            "question_text": "What event dose the woman mention?",
                            "image_url": null,
                            "audio_start_ms": null,
                            "audio_end_ms": null,
                            "correct_answer": "D",
                            "display_number": 32,
                            "sub_order": 1,
                            "explanation": null,
                            "transcript": null,
                            "options": {
                                "A": "A job fair",
                                "B": "A cooking class",
                                "C": "A fund-raiser",
                                "D": "A company picnic"
                            }
                        }
                    ]
                }
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```
---

## Entity: Update  Question

---

Update Question Single
PUT /api/v1/exams/questions

Request:
```json
{
  "exam_id": 1,
  "part_id": 5,
  
  "question_text": "The manager requested that everyone _______ the meeting on time.",
  "option_a": "attend",
  "option_b": "attends",
  "option_c": "attending",
  "option_d": "attended",
  "correct_answer": "A",
  "explanation": "Cấu trúc giả định (Subjunctive): request that S + V(nguyên thể).",
  "image_url": null,
  "audio_start_ms": null,
  "audio_end_ms": null,
  "transcript": null,
  "tags": "ETS_2024, Grammar"
}
```
Response:
```json
{
  "message": "Successfully.",
  "status": "SUCCESS"
}
```

---

Update Question Group
PUT /api/v1/exams/question-groups

```json
Request:
{
  "exam_id": 0,
  "part_id": 0,
  "passage_text": "string",
  "image_url": "string",
  "audio_start_ms": null,
  "audio_end_ms": null,
  "transcript": null,
  "explanation": "string",
  "sub_questions": [
    {
      "question_text": "string",
      "option_a": "string",
      "option_b": "string",
      "option_c": "string",
      "option_d": "string",
      "correct_answer": "string",
      "explanation": "string"
    }
  ]
}
```
```json
Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}
```

---

## Entity: Create Part Direction

---

Create Part Direction
POST /api/v1/exams/part-direction/create
```json
Request:
{
    "exam_id": 0,
    "part_id": 0,
    "direction_text":"string",
    "audio_start_ms": 0,
    "audio_end_ms": 0,
    "example_data": {
        "image_url": "string", 
        "explanation": "string", 
        "audio_end_ms": 0, 
        "audio_start_ms": 0, 
        "correct_option": "string"
    }
}
```
Response:
```json
{
  "message": "Successfully.",
  "status": "SUCCESS"
}
```
Validation Rules:
- exam_id: required,
- part_id: required,
- direction_text: optional,
- audio_start_ms: optional,
- audio_end_ms: optional,
- example_data: optional

---

## Entity: Import Exam Questions

---

Import question
POST /api/v1/exams/import

Request form-data:
{
    exam_id: 1,
    file:file.png
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

## Entity: Category

---

Get All
GET /api/v1/category/get-all

Query Parameter:
limit:10,
page:1

Response:
```json
{
    "data": {
        "pagination": {
            "page": 1,
            "limit": 10,
            "total_records": 10,
            "total_pages": 1,
            "has_next": false,
            "has_prev": false
        },
        "response": [
            {
                "id": 1,
                "parent_id": null,
                "name": "Loại đề",
                "slug": null,
                "type": "collection",
                "status": 1,
                "is_filterable": 1,
                "priority": 1
            }
        ]
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```
---

Get Structure Parent
GET /api/v1/category/structure

Response:
```json
{
    "data": [
        {
            "id": 1,
            "name": "Loại đề",
            "children": [
                {
                    "id": 2,
                    "name": "Full Test (200 câu)"
                }
            ]
        }
    ],
    "message": "Successfully.",
    "status": "SUCCESS"
}
```
---

Get Category Detail (Edit)
GET /api/v1/category/edit/{id}

Path Parameter:
- id (number): Category ID

Response:
```json
{
    "data": {
        "id": 2,
        "parent_id": 1,
        "name": "Full Test (200 câu)",
        "slug": null,
        "type": "collection",
        "status": 1,
        "is_filterable": 1,
        "priority": 1
    },
    "message": "Successfully.",
    "status": "SUCCESS"
}
```
---

Create Category
POST /api/v1/category/create

Request:
{
    "parent_id": null,
    "name":null,
    "slug":"",
    "type": "",
    "status": 1,
    "is_filterable": 1,
    "priority":9999
}

Response:
{
  "message": "Successfully.",
  "status": "SUCCESS"
}

---

Update Category
PUT /api/v1/category/update

Request:
{
    "id": 3,
    "parent_id": null,
    "name":null,
    "slug":"",
    "type": "",
    "status": 1,
    "is_filterable": 1,
    "priority":9999
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
- parent_id: optional,
- name: required
- slug: optional,
- type: required,
- is_filterable: required
- priority: required
- status: required

---

## Entity: Authenticator

---

Login
POST /api/v1/auth/login

Request:
```json
{
    "email":"string",
    "password":"string"
}
```

Response:
```json
{
    "data": {
        "access_token": "string",
        "refresh_token": "string",
        "expires_in": 0
    },
    "message": "string",
    "status": "string"
}
```

---

Refresh Token

POST /api/v1/auth/refresh

Request:
```json
{
    "refresh_token":"string"
}
```

Response:
```json
{
    "data": {
        "access_token": "string",
        "refresh_token": "string",
        "expires_in": 0
    },
    "message": "string",
    "status": "string"
}
```

---
<!-- Notes:
- All endpoints require authentication
- Validation errors return HTTP 400
- Unauthorized access returns HTTP 401
- Forbidden access returns HTTP 403 -->
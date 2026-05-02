# Remarcable Take-Home Assessment
## Overview

This project is a Django + React application for searching and filtering products.

The backend uses Django and SQLite to store products, categories, and tags. The frontend uses React/Vite to display products and provide search/filter controls.

## Requirements Covered

- Created Django models for `Category`, `Tag`, and `Product`
- Added correct relationships:
  - `Category` to `Product`: one-to-many
  - `Product` to `Tag`: many-to-many
- Registered models in the Django admin interface
- Populated the database with sample categories, tags, and products
- Created a Django API endpoint for product search and filtering
- Built a React interface for user interaction
- Used Django QuerySets for search and filtering

## Backend Setup

Go into the backend folder:

```bash
cd backend
```

Activate the virtual environment:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install django django-cors-headers
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

The backend runs at:

```txt
http://127.0.0.1:8000/
```

The Django admin is available at:

```txt
http://127.0.0.1:8000/admin/
```

## Frontend Setup

Go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the React development server:

```bash
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173/
```

## Sample Data

Sample data can be added through the Django admin interface.

A custom command can also generate sample data for testing:

```bash
python manage.py generate_sample_data
```

After generating sample data, it can be viewed or edited in the Django admin interface.

## API Endpoint

The React frontend uses this Django endpoint:

```txt
GET /api/products/
```

Example:

```txt
/api/products/?q=wireless&category=1&tags=2&tags=5&tag_match=all
```

Query parameters:

| Parameter | Purpose |
|---|---|
| `q` | Searches product descriptions |
| `category` | Filters by category ID |
| `tags` | Filters by selected tag IDs |
| `tag_match` | Uses `any` or `all` tag matching |

## Query Logic

Search by description:

```python
products = products.filter(description__icontains=search_query)
```

Filter by category:

```python
products = products.filter(category_id=selected_category)
```

Filter by any selected tag:

```python
products = products.filter(tags__id__in=selected_tags).distinct()
```

Filter by all selected tags:

```python
for tag_id in selected_tags:
    products = products.filter(tags__id=tag_id)
```

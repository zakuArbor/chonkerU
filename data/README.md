### Files
* **math_course.json:** auto-generated
* **math_courses.json:** auto-generated
* **math_prof.json:** auto-generated
* **programs.json:** not-auto generated - manually :(

### programs.json
```
{
    "included": {
        "credits": float,
        "items": [course_item]
    },
    "not-included": {
        "credits": float,
        "items": [course_item]
    }
}
```

**course_item**:
```
{
    "credits": float,
    "included": boolean #optional,
    "courses": course
}
```

**course:**
```
{
    "credits": float,
    "course_code": str,
    "course_name": str
}
```
or 
```
{
    "credits": float,
    "req": str
}
```
# Usage

1. Create `data` directory
2. create `data/MATH` directory
3. `python scrap.py` to scrap course semester info 
4. `cd data/MATH` and `mv MATH*.json MATH`
5. `python scrap-course.py` - to get course description
6. `perl subject2course.pl` - to generate the files
7. `cd ../data/` (i.e. root directory has a directory called data)
8. `cp <files> ../web/public/<dir>`

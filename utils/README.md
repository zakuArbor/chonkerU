# Usage

1. Create `data` directory
2. create `data/MATH` directory
3. Create `../data/prof` directory
4. `python scrap.py` to scrap course semester info 
5. `cd data/MATH` and `mv MATH*.json MATH`
6. `python scrap-course.py` - to get course description
7. `perl subject2course.pl` - to generate the files
8. `cd ../data/` (i.e. root directory has a directory called data)
9. `cp <files> ../web/public/<dir>`

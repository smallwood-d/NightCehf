import os.path as path
import json
from unicodedata import numeric
from fractions import Fraction

from pymongo import MongoClient

mongoClient = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")


def convert_quantity(c):
    c = str(c)
    quantity = '-1'
    try:
        if 'to' in c:
            [low, high] = c.split('to')
            low = convert_unicode_numeric(low.strip())
            high = convert_unicode_numeric(high.strip())
            quantity = f'{low} - {high}'
        elif 'or' in c:
            [low, high] = c.split('or')
            low = convert_unicode_numeric(low.strip())
            high = convert_unicode_numeric(high.strip())
            quantity = f'{low} - {high}'
        elif '/' in c:
            quantity = float(sum(Fraction(s) for s in c.split()))
        else:
            quantity = convert_unicode_numeric(c)
    except Exception as e:
        print(f'Error {e}')
    return quantity


def convert_unicode_numeric(c):
    if len(c) == 1:
        v = numeric(c)
    elif c[-1].isdigit():
        # normal number, ending in [0-9]
        v = float(c)
    else:
        # Assume the last character is a vulgar fraction
        v = float(c[:-1]) + numeric(c[-1])
    return v


def read_write_recipes(file_path):
    with open(file_path, 'r', encoding='utf-8') as infile:
        recipes = json.load(infile)

    db = mongoClient.recepies
    for url, data in recipes.items():
        print(url)
        ingredients_dict = [{'name':i.replace(".", " "),  'quantity': convert_quantity(c)} for c, i in data['ingredients']]
        db.recepies.insert_one({"name": url, "ingredients": ingredients_dict, "instructions": data['instructions']})


read_write_recipes('./sample.json')
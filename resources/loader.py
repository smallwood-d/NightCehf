import json
import re
from unicodedata import numeric
from fractions import Fraction
from pymongo import MongoClient

DB_NAME = "NightChef"
mongoClient = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")


def convert_quantity(c: str) -> float:
    """
    Covert stringify ingredientes quantity.
    :param c: quantity
    :return: float value or better string representation or -1 if the conversion failed.
    """
    c = str(c)
    quantity = -1.0
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


def convert_unicode_numeric(c: str) -> float:
    """
    Covert unicode fraction from string to float.
    :param c: unicode character
    :return: float value
    """
    if len(c) == 1:
        v = numeric(c)
    elif c[-1].isdigit():
        # normal number, ending in [0-9]
        v = float(c)
    else:
        # Assume the last character is a vulgar fraction
        v = float(c[:-1]) + numeric(c[-1])
    return v


def upload_recipes(file_path: str) -> None:
    """
    Upload all the recipes
    :param file_path: source file path
    :return: None
    """
    with open(file_path, 'r', encoding='utf-8') as infile:
        recipes = json.load(infile)

    db = mongoClient[DB_NAME]
    for url, data in recipes.items():

        ingredients_dict = [{'name':i.replace(".", " "),  'quantity': convert_quantity(c)} for c, i in data['ingredients']]
        db.recepies.insert_one({"name": url, "ingredients": ingredients_dict, "instructions": data['instructions']})


def upload_ingredients(file_path: str) -> None:
    """
    Upload all the ingredients
    :param file_path: source file path
    :return:  None
    """
    with open(file_path, 'r', encoding='utf-8') as infile:
        db = mongoClient[DB_NAME]
        for line in infile:
            db.ingredients.insert_one({"name": line.strip()})


def create_ingredients_keys() -> None:
    db = mongoClient[DB_NAME]
    x = db.ingredients.find({}, {"_id": 0})
    re_ingredients = re.compile('(' + '|'.join(map(lambda e : e['name'] + 'e?s?', x)) + ')', flags=re.IGNORECASE|re.ASCII)
    # print(re_ingredients)
    lk = '(' + '|'.join(map(lambda e : e['name'] + 'e?s?', x)) + ')'
    # db.recepies.update_many({}, [{"$set": {"modified": "$$NOW"}}])
    y = db.recepies.aggregate([
        {
            "$addFields": {
                "keys": {
                    "$map": {
                        "input": "$ingredients",
                        "as": "grade",
                        "in": {"$regexFind": {"input": "$$grade.name", "regex": re_ingredients}}
                    }
                }
            }
        },
        {
            "$addFields": {
                "keys": "$keys.match"
            }
        },
        {
            "$project": {
                "keys": 1,
                "name": 1,
                "ingredients": 1,
                "_id": 0
            }
        },
        {"$out":{"db": "NightChef", "coll": "data"}}
    ])

upload_recipes('./sample - Copy.json')
upload_ingredients('./Food.csv')
create_ingredients_keys()
import os.path as path
import json

from pymongo import MongoClient

mongoClient = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")


def read_write_recipes(file_path):
    with open(file_path, 'r', encoding='utf-8') as infile:
        recipes = json.load(infile)

    db = mongoClient.recepies
    for url, data in recipes.items():
        print(url)
        ingredients_dict = [{'name':i.replace(".", " "),  'quantity': str(c)} for c, i in data['ingredients']]
        db.recepies.insert_one({"name": url, "ingredients": ingredients_dict, "instructions": data['instructions']})


read_write_recipes('./sample.json')
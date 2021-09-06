from html.parser import HTMLParser
import requests
import json
import time

import asyncio

BASE_URL: str = "https://cooking.nytimes.com"


class MyHTMLParser(HTMLParser):

    def __init__(self, url):
        super().__init__()
        self.name = url[url.rfind('/'):]
        self.url = url
        self._ingredients = []
        self._instructions = []
        self._recipes = set()
        self.__ingredients_flag: bool = False
        self.__instruction_flag: bool = False

    @property
    def recipes(self):
        return self._recipes

    def _add_ingredient(self, ingredient):
        last_ingredient = [] if not self._ingredients else self._ingredients[-1]
        if len(last_ingredient) == 1:
            self._ingredients[-1].append(ingredient)
        else:
            self._ingredients.append([ingredient if ingredient else 0])

    def error(self, message):
        print(f"Error: {message}")

    def handle_starttag(self, tag, attrs):
        if (('class', 'quantity') in attrs
                or ('class', 'ingredient-name') in attrs):
            self.__ingredients_flag = True
        elif tag == "ol" and ('class', 'recipe-steps') in attrs:
            self.__instruction_flag = True
        else:
            for attr in attrs:
                if attr[0] == 'href':
                    if attr[1].startswith(BASE_URL):
                        self._recipes.add(attr[1])
                    elif attr[1].startswith("/recipes/"):
                        self._recipes.add(BASE_URL + attr[1])

    def handle_endtag(self, tag):
        if tag == "ol" and self.__instruction_flag:
            self.__instruction_flag = False

    def handle_data(self, data):
        data = data.strip()
        if self.__ingredients_flag:
            self._add_ingredient(data)
            self.__ingredients_flag = False
        if data and self.__instruction_flag:
            self._instructions.append(data)

    def __repr__(self):
        return f"""name: {self.name}; 
               ingredients: {self._ingredients};
               instructions: {self._instructions};
               recipes: {self._recipes}"""

    def __str__(self):
        return json.dumps(self.dump(), ensure_ascii=False)

    def dump(self):
        data = dict()
        data['ingredients'] = self._ingredients
        data['instructions'] = self._instructions
        return {self.url: data}

visited = set()
going_to_visit = set()
going_to_visit.add("https://cooking.nytimes.com/recipes/1022473-extra-crispy-blt")
idx = 0
limit = 2
recipes_join = dict()
try:
    while going_to_visit and idx < 5000:
        idx += 1
        url = going_to_visit.pop()
        visited.add(url)
        parser = MyHTMLParser(url)
        respond = requests.get(url)
        parser.feed(respond.text)
        print(parser.name, len(going_to_visit), len(visited))

        recipes_join.update(parser.dump())
        for recipe in parser.recipes:
            if recipe not in visited and recipe not in going_to_visit:
                going_to_visit.add(recipe)

        time.sleep(3.7)
finally:
    with open("sample.json", "w", encoding="utf-8") as recipes_file:
        json.dump(recipes_join, recipes_file, indent=4, ensure_ascii=False)

# loop = asyncio.get_event_loop()
# loop.run_until_complete(run_tests())
# loop.close()

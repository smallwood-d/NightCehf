import {Router, Request, Response } from "express";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { Rogger }  from './utils/logger';
import { DB } from "./api/db";
const logger = Rogger.getRogger(__filename);


export function ncMockRouterInit() {
    const ncMockRouter: Router = Router();

    /**
     * @openapi
     * /databases:
     *   get:
     *     description: Return the databases list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
     ncMockRouter.get('/databases', async (req: Request, res: Response) => {
        const value = ["admin","config","local","recepies"];
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    });

    /**
     * @openapi
     * /collections:
     *   get:
     *     description: Return the recepies DB collections list.
     *     responses:
     *       200:
     *         description: Array of strings
     */
     ncMockRouter.get('/collections', async (req: Request, res: Response) => {
        const value = ["recepies"];
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    });

    /**
     * @openapi
     * /getRecepies:
     *   get:
     *     description: Return all recepies that contain at least one ingredient
     *                  from the ingredients list.
     *     parameters:
     *       - in: query
     *         name: ingredients
     *         description: List of ingredients to search for.
     *         schema:
     *           type: string
     *           example: oil, egg
     *         required: true
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           example: 3
     *         description: The number of items to skip before starting to collect the result set
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           example: 5
     *         description: The numbers of items to return
     *     responses:
     *       200:
     *         description: Returns JSON with all the match recepies.
     */
     ncMockRouter.get('/getRecepies', async (req: Request, res: Response) => {
        const value = [{"_id":"61371162217cbe9ccdd64aa1","name":"https://cooking.nytimes.com/recipes/1022475-lemon-labneh-possets-with-meringue-and-burnt-lemon-powder","ingredients":[{"name":"pound/450 grams Greek yogurt","quantity":1},{"name":"teaspoon kosher salt","quantity":0.5},{"name":"tablespoon lemon zest (from 1 to 2 lemons)","quantity":1},{"name":"cup plus 2 teaspoons/200 grams lemon juice (from about 4 to 5 lemons)","quantity":0.75},{"name":"cups/250 grams granulated sugar","quantity":1.25},{"name":"cups/650 grams heavy cream (double cream)","quantity":2.75},{"name":"ounces/200 grams labneh (homemade or store-bought)","quantity":7},{"name":"cup plus 1 tablespoon/115 grams granulated sugar","quantity":0.5},{"name":"egg whites (65 grams), from 2 large eggs","quantity":2},{"name":"teaspoon cream of tartar","quantity":0.125},{"name":"unwaxed (or well-scrubbed) lemons","quantity":2}],"instructions":["Make the labneh: Add yogurt and salt to a bowl and mix well to combine. Line a medium sieve with a piece of cheesecloth or a clean tea towel with plenty of overhang. Add yogurt, and pull the overhang up and over the yogurt to encase it. Set the sieve over a bowl and place a weight on top. (A couple of cans — or tins — will do.) Refrigerate for 24 to 48 hours. When ready, discard the liquid collected and store the labneh in a sealed container in the refrigerator for up to 3 days. (You should have about 9 ounces/250 grams of labneh.) If using store-bought labneh, skip this step.","Measure out a scant 1/2 cup (about 7 ounces/200 grams) of labneh for the possets, and reserve the rest for breakfast or to spread onto toast.","Prepare the possets: Combine lemon zest, juice and sugar in a medium saucepan and bring to a boil over medium-high heat, stirring occasionally to dissolve sugar. Set aside once the sugar has dissolved. In a separate medium saucepan, heat heavy cream (double cream) over medium until it just gently starts to bubble, 7 to 10 minutes. Off the heat, pour all the cream into the lemon mixture and whisk until combined, then whisk in labneh until smooth. Strain mixture through a fine-mesh sieve set over a jug with a spout. Divide mixture across 8 glasses. Refrigerate for at least 4 hours, or overnight if you’re getting ahead.","Prepare the meringue: Heat oven to 350 degrees Fahrenheit/180 degrees Celsius. Spread sugar onto a baking sheet (baking tray) and heat for 10 minutes, until very hot but not melted at all. A couple of minutes before it’s ready, add egg whites and cream of tartar to a stand mixer fitted with the whisk attachment (or alternatively, use an electric hand mixer), and beat on medium until frothy, about 1 minute. Remove sugar from oven and turn down the temperature to 250 degrees Fahrenheit/120 degrees Celsius. Turn mixer speed to low and slowly stream in the warm sugar until it’s all incorporated. Turn the speed back up to high, and beat until glossy and stiff peaks form, another 5 to 6 minutes. Line a large (roughly 16-by-12-inch/40-by-30-centimeter) baking sheet (baking tray) with parchment paper and use a spatula to thinly spread the mixture onto the lined tray, so it’s about 14 by 10 inches/35 by 25 centimeters. Bake for 80 to 90 minutes, until completely dried out. Set aside to cool, about 30 minutes, then roughly break apart into random shards.","Prepare the burnt lemon powder: Turn oven up to 450 degrees Fahrenheit/240 degrees Celsius. Use a small, sharp knife to cut the peel off the lemons in long strips. (Don’t worry if you get some of the pith.) You want about 1 ounce/30 grams in total. Transfer strips to a small, parchment-lined baking sheet (baking tray). Bake for 12 to 15 minutes, until completely dry and almost burned. (They’ll shrivel significantly.) Transfer to a pestle and mortar to finely grind, then pass through a sieve, to catch any large pieces. (Discard these.) You should be left with about 1 1/2 teaspoons.","Segment the lemons: Using the small, sharp knife, trim off any excess peel, then cut between the membranes to release the segments. Roughly chop each segment into 2 to 3 pieces. (Use them all if you like things a little sharp, or keep any extra in the fridge for a vinaigrette or salsa verde.)","To serve, top possets with lemon segments, a sprinkling of burnt lemon powder and a few meringue shards, serving any extra meringue to dip alongside."]},{"_id":"61371162217cbe9ccdd64aa2","name":"https://cooking.nytimes.com/recipes/1022288-grilled-okra-with-cajun-remoulade","ingredients":[{"name":"Vegetable oil, for the grill grates","quantity":0},{"name":"pound okra (small pods are the most tender)","quantity":1},{"name":"tablespoons melted butter or extra-virgin olive oil","quantity":3},{"name":"Cajun or Creole seasoning or blackening spice mixture, for sprinkling","quantity":0},{"name":"cup mayonnaise","quantity":0.75},{"name":"tablespoons Creole or Dijon mustard","quantity":3},{"name":"tablespoon prepared horseradish","quantity":1},{"name":"tablespoon pickle juice (optional)","quantity":1},{"name":"teaspoon Tabasco or other Louisiana-style hot sauce, or to taste","quantity":1},{"name":"teaspoon pimentón (smoked paprika)","quantity":1},{"name":"teaspoon Cajun seasoning","quantity":1},{"name":"tablespoon chopped fresh chives","quantity":1}],"instructions":["Set up your grill for direct grilling and heat your grill to high (450 to 600 degrees). Brush or scrape the grill grate clean and oil it with a tightly folded paper towel dipped in vegetable oil and drawn across the bars of the grate with tongs.","Meanwhile, trim the very ends off the stems of the okra, but do not cut into the pods. Lay 4 to 6 okra pods side by side, alternating the positions of the heads and tails. Pin crosswise near the heads and tails with toothpicks or short metal or bamboo skewers to form rafts. If the bamboo skewers extend far beyond the okra, snip off the long ends of the skewers. Brush the okra rafts on both sides with melted butter and sprinkle with Cajun seasoning.","Make the rémoulade sauce: Place the mayonnaise in a mixing bowl and whisk in the mustard, horseradish, pickle juice (if using), hot sauce, pimentón, Cajun seasoning and chives. Transfer to 4 small serving bowls.","Arrange the okra rafts on the grate and grill (covered if you are using a gas grill), basting with any remaining butter and turning with tongs, until well browned on both sides, 2 to 4 minutes per side.","Transfer the okra to a platter or plates. Have each eater remove and discard the skewers and pick up the grilled okra with their fingers to dip in the rémoulade sauce."]}];
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    });

    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
            title: 'NightChef',
            version: '0.0.1',
            },
        },
        apis: [path.join(__dirname, '*.js')], // files containing annotations as above
        };

    const openapiSpecification = swaggerJsdoc(options);

    ncMockRouter.use('/api-docs', swaggerUi.serve);
    ncMockRouter.get('/api-docs', swaggerUi.setup(openapiSpecification));

    return ncMockRouter;
}

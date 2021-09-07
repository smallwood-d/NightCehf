# NightChef
Search the right recipes base on your ingredients.

## Client
TBD
## Server
Running a webserver giving recipes information.  
Quiring and calculating the best match for your ingredients.    
  
### Running instruction
Before running the server
```shell
$ cd resources
$ docker-compose up -d
```
If it's the first time (or when there is no DB data) run:
```shell
$ cd resources
$ ./loader.exe
```
Help and usage `node index.js -h`  
 - `-s \ --server` run the server  

### Supported APIs
 - **/about** small info message/
 - **/databases** return all the avaible databases
 - **/collections** return all the collecotions of the database 
 - **/getRecepies** return all the recipies match by the ingredients.
 - **/api-docs** Swagger page.

open the project folder "D:\Studies\ReactCommentsProjectIQB" in visual studio 

1) To install and start ONLY NODEjs server / API : 

	\ReactCommentsProjectIQB> npm run server  
	This executes the script below   from package.json 
		"scripts": {
		"server": "npm install && nodemon server.js"
		
2) 	To install and start ONLY REACT app : 

	   a) cd cleint
	   b) ReactCommentsProjectIQB\client> npm start
	   This executes the script below   from package.json  from client folder 
	   
3) To start BOTH API and REACT App together : This command takes a while ,please Wait till it install all the required packages and start the React applicartion 
		
		ReactCommentsProjectIQB> npm run dev 
		
		This exeucte the script below 
		"server": "npm install && nodemon server.js",
		"react": "cd client && npm install && npm start ",
		"dev": "concurrently \"npm install\" \"npm run server\" \"npm run react\" "
		
4) used wild card search on 3 columns ..i.e even if one character matches with search, it gives the result 		

      	   
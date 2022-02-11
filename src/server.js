const http = require('http');
const url = require('url');
const query = require('querystring'); 
const htmlHandler = require('./htmlResponses.js'); 
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


const handlePost = (request, response, parsedUrl) => {
  
  if(parsedUrl.pathname === '/addUser'){
    //call parseBody handler, pass in addUser as callback function
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleHead = (request, response, parsedUrl) => {

};

//todo, check head request example for more info
const handleGet = (request, response, parsedUrl) => {
  if(parsedUrl.pathname === '/style.css'){
    htmlHandler.getCSS(request, response);
  }
  else if (parsedUrl.pathname === '/getUsers'){
    jsonHandler.getUsers(request, response);
  }
  else{
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  //check what method type it is
  if(request.method === 'POST'){
    handlePost(request, response, parsedUrl);
  }
  else if(request.method === 'HEAD'){
    handleHead(request, response, parsedUrl);
  }
  else{
    handleGet(request, response, parsedUrl);
  }
}
//Recompiles body of request, calls appropriate handler once completed. 
//This exists because different request types handle content differently.
const parseBody = (request, response, handler) => {
  //Request pieces storage
  const body = [];

  //Check for errors, send bad request back to client if so
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  //Piece of body received, put it in array so they arrive in correct order
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  //Request is finished sending, all info received. Turn body into single entity using concat,
  //turn into string that we can use with querystring library to turn into object. If it's in JSON
  //we could use JSON.parse instead
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    //Once object finished assembling, call handler function and proceed as normal
    handler(request, response, bodyParams);
  });
};

//previous assignment code commented out for personal reference
/*
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getUsers': jsonHandler.getUsers,
  '/addUser': jsonHandler.postUser, 
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};
*/
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});
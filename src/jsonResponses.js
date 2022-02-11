const users = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json'});
    response.write(JSON.stringify(object));
    response.end();
};
//responding without json body attached
const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, {'Content-Type': 'application/json'});
    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };

    responseJSON(request, response, 200, responseJSON);
};

const addUser = (request, response, body) => {
    const responseJSON = {
        message: 'Name and age are both required.',
    };

    //check if both fields exist. as is it can be abused with invalid types
    if(!body.name || !body.age) {
        responseJSON.id = 'missingParams';
        return respondJSON (request, response, 400, responseJSON);
    }

    //content updated, not done yet
    let responseCode = 204;

    //empty user created
    if(!users[body.name]){
        responseCode = 201;
        users[body.name] = {};
    }

    users[body.name].name = body.name;
    users[body.name].age = body.age;

    //Response created, send response with message
    if (responseCode === 201){
        responseJSON.message = 'Created Successfully';
        return respondJSON (request, response, responseCode, respondJSON);
    }
    //Success but with an empty payload. 204 status code doesn't alter the browser (i.e. no redirects)
    return respondJSONMeta(request, response, responseCode)
};

const notFound = (request, response, acceptedTypes) => {
    const responseJSON = {
        message: 'The page you are looking for does not exist.',
        id: 'notFound',
    };

    /*
    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;

        return respond(request, response, 404, xmlString, 'text/xml');
    }
    */
    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 404, jsonString, 'application/json');
}

module.exports = {
    getUsers,
    addUser,
    notFound
}

//previous assignment code commented out for personal refernece
/*
const respond = (request, response, status, content, mimetype) => {
    response.writeHead(status, { 'Content-Type': mimetype });
    response.write(content);
    response.end();
};


const success = (request, response, acceptedTypes) => {
    const responseJSON = {
        message: 'This is a successful response',
    };

    //If accepted type is xml, send xml
    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response>
            <message>${responseJSON.message}</message>
        </response>`;

        return respond(request, response, 200, xmlString, 'text/xml');
    }

    //Otherwise
    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 200, jsonString, 'application/json');
};

const badRequest = (request, response, acceptedTypes, params) => {
    const responseJSON = {
        message: 'This request has the required parameters.',
    };

    //   /badRequest?valid=true
    if(!params.valid || params.valid !== 'true') {
        responseJSON.message = 'Missing valid query param set to true';
        responseJSON.id = 'badRequestMissingParam';

        //if acceptedTypes is xml, send back xml
        if(acceptedTypes[0] === 'text/xml') {
            const xmlString = `<response>
                <message>${responseJSON.message}</message>
                <id>${responseJSON.id}</id>
            </response>`;
    
            return respond(request, response, 400, xmlString, 'text/xml');
        }
        //otherwise send json
        const jsonString = JSON.stringify(responseJSON);
        return respond(request, response, 400, jsonString, 'application/json');
    }

    //if acceptedTypes is xml, send back xml
    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response>
            <message>${responseJSON.querySelector('message').textContent}</message>
        </response>`;

        return respond(request, response, 200, xmlString, 'text/xml');
    }

    //otherwise send json
    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 200, jsonString, 'application/json');
}

const unauthorized = (request, response, acceptedTypes, params) => {
    const responseJSON = {
        message: 'This request has the required parameters.',
    };

    if(!params.loggedIn || params.loggedIn !== 'yes')
    {
        responseJSON.message = 'Missing loggedIn query parameter set to yes';
        responseJSON.id = 'unauthorizedMissingParam';
        if(acceptedTypes[0] === 'text/xml')
        {
            const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;
            return respond(request, response, 401, xmlString, 'text/xml');
        }

        const jsonString = JSON.stringify(responseJSON);
        return respond(request, response, 401, jsonString, 'application/json');
    }

    if(acceptedTypes[0] === 'text/xml')
    {
        const xmlString = `<response><message>${responseJSON.querySelector('message').textContent}</message></response>`;
        return respond(request, response, 200, xmlString, 'text/xml');
    }

    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 200, jsonString, 'application/json');
}

const forbidden = (request, response, acceptedTypes) => {
    const responseJSON = {
        message: 'You do not have access to this content.',
        id: 'forbidden',
    };

    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;

        return respond(request, response, 403, xmlString, 'text/xml');
    }

    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 403, jsonString, 'application/json');
}

const internal = (request, response, acceptedTypes) => {
    const responseJSON = {
        message: 'Internal Server Error. Something went wrong.',
        id: 'internalError',
    };

    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;

        return respond(request, response, 500, xmlString, 'text/xml');
    }

    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 500, jsonString, 'application/json');
}

const notImplemented = (request, response, acceptedTypes) => {
    const responseJSON = {
        message: 'This page has not been implemented yet. Check back later for updates.',
        id: 'notImplemented',
    };

    if(acceptedTypes[0] === 'text/xml') {
        const xmlString = `<response><message>${responseJSON.message}</message><id>${responseJSON.id}</id></response>`;

        return respond(request, response, 501, xmlString, 'text/xml');
    }

    const jsonString = JSON.stringify(responseJSON);
    return respond(request, response, 501, jsonString, 'application/json');
}
*/
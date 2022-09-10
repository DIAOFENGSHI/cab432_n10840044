// Create the DynamoDB service client module using ES6 syntax.
const { DynamoDBClient } = require( "@aws-sdk/client-dynamodb");
// Set the AWS Region.
const REGION = "ap-southeast-2"; // For example, "us-east-1".
const accessKeyId = "ASIA5DYSEEJ4UT75MFEP"
const secretAccessKey = "nmDQU4U3Rg9dpHbdSzCu5jm5J5I6NW5Cr3CJffMU"
const sessionToken = "IQoJb3JpZ2luX2VjEMH//////////wEaDmFwLXNvdXRoZWFzdC0yIkgwRgIhAJ628LBEhLB2ruWZzFzxgtFONgxPrG/mOqiCL2qQtzO4AiEAoecxUgVjGeXxN6hrbAhiq7cebBjEgzdi67gND7bkoFoqrwMIWhACGgw5MDE0NDQyODA5NTMiDI3mE3quiK7cCtzBTSqMA/ToocITOfwcqU50RqX2TodvVYWHziWvw5IBs2mpWjbPpgqN+hbnYeYSgO9FJgY08f41FOeQbqE9elSVPn6GDBGqGy4t/KofsxO73S4QPdV1Ea5QAe4ys9zDZuPfYCPn0qMEAW8SqADBK18Hq5CobQQE+cZlW2LIHvcNzKpSJ3VQn18SdkAaj3THV6Nu19k8aHmMweJS2jlK67zA53fK4AhIsmtqYVxQnOcTxTFjVxk9/PfMBv1t8qqQTQYxM3RFLgtYT2aLYcWRAn4vIj6mj3UWgQ+34pfrQZAudVTP0nzMsTo2z6aCUC6w+TZ0aTIB8mXxJLFZITvJEj0hP58ynE2mFcrTTxRpN0nyYZimzQ5td9JYtsThcq2BE45Bghc11obvpcfOmfG0lMb0+BRkV0vPwoRAP1AVt9Siq1RKyEv4Qn7ROvMUlfpTrhd5XL9EwEV2+UWyAsNPn7MkFBH4WhhQglyRn8v/ncdoRvI8LKhUqunGMoibYlz2Sy4+8k0UYzqodhrmIyGjhYUQWTCjlfGYBjqlAeuPErJqr4IZpn1uHz+MBZ4JLvwBvOWo9pkqqYn8HqElSBSVXwl0DRaO4NbEEV1gvw+Wn3NCftGfRWjiOjMYaVkNKTSZJ6SynKH9l6I6igd8Kjf+748ai8k05eEtA8ExYoP3upTw14NINKU3tNgz1n0LMyNS+Fb8NdjCQZgilBLxSvd6wxi3qgzO1gYS3ylnDdRUXJ0qfQgrQYsSFok5ngbeAmtiHw=="
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ 
    region: REGION, 
    credentials:{
      accessKeyId:accessKeyId,
      secretAccessKey:secretAccessKey,
      sessionToken:sessionToken
    }
});

module.exports = {ddbClient}
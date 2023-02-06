//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//https://openjavascript.info/2022/01/03/using-fetch-to-make-get-post-put-and-delete-requests

//Let's use fetch to access and modify a database through a WebApi using GET, POST, PUT, DELETE requests
//Le'ts use my WebApi generating random customers and orders, using a mySQL database version called MariaDb

const urlBase = "https://localhost:7249";

const urlID = urlBase + "/id";
const urlLogin = urlBase + "/api/login";
const urlFriends = urlBase + "/api/friends";
const urlQuotes = urlBase + "/api/quotes";

async function myFetch(url, method = null, body = null) {
  try {

    let res = await fetch(url, {
      method: method ?? 'GET',
      headers: { 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : null
    });

    if (res.ok) {

      console.log("Request successful");

      if (method == 'PUT' || method == 'DELETE')
        //request is successful, but WebAPI is not send a response, so I return the body which represenst the effect on the database
        return body;

      //get the data from server
      let data = await res.json();
      return data;
    }
    else {

      console.log(`Failed to recieved data from server: ${res.status}`);
      //alert(`Failed to recieved data from server: ${res.status}`);
    }
  }
  catch (err) {

    console.log(`Failed to recieved data from server: ${err.message}`);
    //alert(`Failed to recieved data from server: ${err.message}`);
  }
}

//Lets use myFetch. As it is an async method and I cannot have await at top level, I need to make trick.
//See analogy on making in C# main async
//I make main as an asych arrow function with immediate execution of syntax, (async() => {})();

(async () => {

  //Here I write all the code to be executed at script top level, c# main level

  //Test Get WebApi ID
  console.log("Testing Reading WebApi ID");
  let data = await myFetch(urlID);
  console.log(data);

  //Test GET api/login/loginuser
  console.log("\nTesting Login a User");
  let apiKey = await myFetch(urlLogin + '/loginuser', 'POST', { UserName: "User1", Password: "pa$$W0rd"});
  console.log(apiKey);

  //Test GET api/friends
  console.log("Test GET all friends and list the 5 first");
  data = await myFetch(`${urlFriends}?apiKey=${apiKey}`);
  if (data) {

    //List the first 5 customers
    data.slice(0, 5).forEach(element => { console.log(element) });
  }

  //Test GET api/friends?count=5
  console.log("Test GET all firends and list the 5 first");
  data = await myFetch(`${urlFriends}?apiKey=${apiKey}&count=5`);
  if (data) {

    //List the first 10 customers
    data.forEach(element => { console.log(element) });
  }

  
  //Test GET api/friends/{Id}
  console.log("Test GET specific friend");
  let friend = await myFetch(`${urlFriends}/${data[0].friendID}?apiKey=${apiKey}`);
  if (friend) {

    console.log(friend);
  }

  //Test PUT to change the details of a friend /api/friends/{custId}
  console.log("Test PUT to change the details of a friend");
  friend.firstName += '_Updated';
  friend.lastName += '_Updated';
  data = await myFetch(`${urlFriends}/${friend.friendID}?apiKey=${apiKey}`, 'PUT', friend);
  if (data) {

    console.log(data);
  }

  //Test DELETE to remove the friend from the database
  console.log("Test DELETE to remove a friend from the database");
  await myFetch(`${urlFriends}/${friend.friendID}?apiKey=${apiKey}`, 'DELETE');
  
  //confirm that the friend no longer exist in the database
  data = await myFetch(`${urlFriends}/${friend.friendID}`);
  if (data == null) {

    console.log("`friend ${friendID} does not exist");
  }
  else {

    console.log(data);
  }

   //Test POST to create a new friend /api/friends
  console.log("Test POST to create a new specific friend");
  data = await myFetch(`${urlFriends}?apiKey=${apiKey}`, 'POST', friend);
  if (data) {

    console.log(data);
  }


  //Test GET api/quotes
  console.log("Test GET all quotes and list the 5 first");
  data = await myFetch(`${urlQuotes}?apiKey=${apiKey}`);
  if (data) {

    //List the first 5 customers
    data.slice(0, 5).forEach(element => { console.log(element) });
  }

  //Test GET api/friends?count=5
  console.log("Test GET all quotes and list the 5 first");
  data = await myFetch(`${urlQuotes}?apiKey=${apiKey}&count=5`);
  if (data) {

    //List the first 5 quotes
    data.forEach(element => { console.log(element) });
  }

})();


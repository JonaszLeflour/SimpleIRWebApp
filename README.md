|# Impact VR - master
## What we want
The **client** visualisation is done on Unreal Engine 4. The **seller** view will be a simple web page with a mini map and a marker with where the **client** is currently.

Technically speaking, we are going to use polling, which means, that we are going to use a simple HTTP server, using **nodejs** that will make the interface between Unreal Engine and the web page.

Each of them are going to poll the server for information every n seconds. 

So every n seconds :

* Unreal Engine Software is going to call an endpoint on the web server to see if it need to teleport. While doing that will also send back information about location.
* The backend server will reply to Unreal Engine request with some data to see if it needs teleportation and store the current position of the client.
* The web page will poll the backend server every n seconds as well to know the position of the client. 
* When the seller click on the mini map, the web page will send a teleportation order to the backend.

## Client-side

This is a client-side web app that should behave exactly as playcanvas did previously
Diffe
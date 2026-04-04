POST/signup
POST/login
POST/logout

GET/profile/view
PATCH/profile/edit
PATCH/profile/password

// ConnectionRequest Router
POST/request/send/intrested/:userId
POST/request/sent/ignore/:userId

POST/request/review/accepted/:requestId
POST/request/review/rejected/:rejectedId

//user routers
GET/connections
GET/request/requests
GET/feed --gets you the all the profiles

status: ignore, intrested, accepted, rejected
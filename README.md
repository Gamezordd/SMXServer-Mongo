## Express + MongoDB Server for a simple social netwok supporting the following features:

  - Authentication using passport.
  - JWT Verification on endpoints to maintain session for upto 24-Hours.
  - Two-factor authentication supported using SMS.
  - Creation of "Posts".
  - "Likes" feature for posts supported.
  
###Exposed endpoints:

####No authentication necessary:
  - '/users/sendotp/<phone number>' - GET - To generate and send an OTP to said phone number.
  - '/users/login' - POST - To login using username, password and recieved otp in the body.
  - '/users/signup' - POST - Create new account.
  
####Authentication required:
  - '/posts' - POST - Create new post.
  - '/posts/<postId>' - GET - Add a like/dislike if previously liked to the post with id = postId.
  

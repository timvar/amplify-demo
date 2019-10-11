import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';


Amplify.configure(awsconfig);

Amplify.configure({
    Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-1_BLiQe2HTM',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '50vte5k4orevnh6bc95acpd825',
  }
});


async function SignIn(username, password) {
  try {
      const user = await Auth.signIn(username, password);
      console.log('user', user);
      
  } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
          // The error happens if the user didn't finish the confirmation step when signing up
          // In this case you need to resend the code and confirm the user
          // About how to resend the code and confirm the user, please check the signUp part
      } else if (err.code === 'PasswordResetRequiredException') {
          // The error happens when the password is reset in the Cognito console
          // In this case you need to call forgotPassword to reset the password
          // Please check the Forgot Password part.
      } else if (err.code === 'NotAuthorizedException') {
          // The error happens when the incorrect password is provided
      } else if (err.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
          console.log(err);
      }
  }
}

SignIn('fejop@getnada.com', 'fejo1234');


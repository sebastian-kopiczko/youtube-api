// options
const CLIENT_ID = '960910439848-1eab1mcd0kiru60i577u0g43hj5r350l.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';
const authorizeButton = document.querySelector('#login-button');
const signoutButton = document.querySelector('#logout-button');
const content = document.querySelector('#content');
const channelForm = document.querySelector('#channel-form');
const channelInput = document.querySelector('#channel-input');
const channelData = document.querySelector('#channel-data');
const videoContainer = document.querySelector('#video-container');
const defaultChannel = 'techguyweb';

//load auth2 lib
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// init API client lib and setup siging listeners
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        // listen for sign in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // handle initial sign in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleLoginClick;
      signoutButton.onclick = handleLogoutClick;
    });
}
// update ui sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// handle login
function handleLoginClick() {
    gapi.auth2.getAuthInstance().signIn();
}
// handle logout
function handleLogoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}
// get channel from api
function getChannel(channel) {
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => alert('There is not channel by given name'));
}
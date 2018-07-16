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

// form subbmit and change chanel variable
channelForm.addEventListener('submit', e =>{
    e.preventDefault();
    const channel = channelInput.value;
    getChannel(channel);
})

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
// display channel data
function showChannelData(data) {
    channelData.innerHTML = data;
}
//convert string to number with spaces
function toLocalString(input){
    return (Number(input)).toLocaleString();
}
// get channel from api
function getChannel(channel) {
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
    .then(response => {
        console.log(response);
        const channel = response.result.items[0];
        const output = `
            <ul class="collection">
                <li class="collection-item">Title: ${channel.snippet.title}</li>
                <li class="collection-item">ID: ${channel.id}</li>
                <li class="collection-item">Subscribers: ${toLocalString(channel.statistics.subscriberCount)}</li>
                <li class="collection-item">Views: ${toLocalString(channel.statistics.viewCount)}</li>
                <li class="collection-item">Videos: ${toLocalString(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
        `;
        showChannelData(output);
        const playlistId = channel.contentDetails.relatedPlaylists.uploads;
        requestVideoPlaylist(playlistId);
    })
    .catch(err => alert('There is not channel by given name'));
}

function requestVideoPlaylist(playlistId) {
    const requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 10
    }
    const request = gapi.client.youtube.playlistItems.list(requestOptions);
    request.execute(response => {
        console.log(response);
        const playlistItems = response.result.items;
        if(playlistItems){
            let output = '<h4 class="align-center">Latest videos</h4>'
            // loop through videos and append output
            playlistItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;
                output += `
                <div class="col s3">
                    <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
                `;
            });
            // output videos
            videoContainer.innerHTML = output;
        } else{
          videoContainer.innerHTML = 'No uploaded videos'  
        }
    });
}
const ui = new UserInterface();

//load auth2 lib
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

const clientID = '180268192986-p34bc21428sjnql1vef6gi8ca5a3qesr.apps.googleusercontent.com';
const discoveryDocs =  ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const scopes = 'https://www.googleapis.com/auth/youtube.readonly';

// init API client lib and setup siging listeners
function initClient() {
    gapi.client.init({
        discoveryDocs: discoveryDocs,
        clientId: clientID,
        scope: scopes
    }).then(() => {
        // listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // handle initial sign in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        ui.authorizeButton.onclick = handleLoginClick;
        ui.signoutButton.onclick = handleLogoutClick;
    });
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
    ui.channelData.innerHTML = data;
}

// update ui sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        ui.changeState('signed-in');
    } else {
        ui.changeState('signed-out');;
    }
}

// get channel from api
ui.channelForm.addEventListener('submit', (e) => {
    const channel = ui.channelInput.value;
    getChannel(channel);
    e.preventDefault();
})

function getChannel(channel) {
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
    .then(response => {
        console.log(response);
        const channel = response.result.items[0];
        ui.displayChannelData(channel);

        const playlistId = channel.contentDetails.relatedPlaylists.uploads;
        requestVideoPlaylist(playlistId);
    })
    .catch(err => alert('There is no channel with given name'));
}

// get latest videos playlist
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
            ui.displayLatestVideos(playlistItems);
        } else {
          ui.videoContainer.innerHTML = 'No uploaded videos'  
        }
    });
}
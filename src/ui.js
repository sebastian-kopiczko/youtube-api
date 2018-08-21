class UserInterface{
  constructor(){
    this.authorizeButton = document.querySelector('#login-button'),
    this.signoutButton = document.querySelector('#logout-button'),
    this.content = document.querySelector('#content'),
    this.channelForm = document.querySelector('#searchChannel-form'),
    this.channelInput = document.querySelector('#searchChannel-input'),
    this.channelData = document.querySelector('#channel-data'),
    this.videoContainer = document.querySelector('#video-container'),
    this.videoForm = document.querySelector('#searchVideo-form'),
    this.videoInput = document.querySelector('#searchVideo-input')
  }
  
  displayChannelData(channel){
    const output = `
      <ul class="collection">
          <li class="collection-item">Title: ${channel.snippet.title}</li>
          <li class="collection-item">ID: ${channel.id}</li>
          <li class="collection-item">Subscribers: ${channel.statistics.subscriberCount.toLocaleString('pl-PL')}</li>
          <li class="collection-item">Views: ${channel.statistics.viewCount.toLocaleString('pl-PL')}</li>
          <li class="collection-item">Videos: ${channel.statistics.videoCount.toLocaleString('pl-PL')}</li>
      </ul>
      <p>${channel.snippet.description}</p>
      <div class="divider"></div>
      <div class="center-align">
          <a class="btn visitChannel-btn inline-block grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
      </div>    
    `;
    this.channelData.innerHTML = output;
  }

  displayVideos(items, type){
    let output;
    if(type === 'channel'){
      output = '<h4 class="center-align">Latest videos</h4>'
      items.forEach(item => {
        const videoId = item.snippet.resourceId.videoId;
        const videoTitle = item.snippet.title;
        const videoDesc = item.snippet.description;
        const videoPublished = new Date(item.snippet.publishedAt).toLocaleString('pl-PL');
        output += `
        <div class="col s12 m6 offset-m3 l4">
            <div class="card">
                <div class="card-image">
                    <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    <div class="badge blue lighten-4 right-align">Published ${videoPublished} </div>
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${videoTitle}<i class="material-icons right">more_vert</i></span>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${videoTitle}<i class="material-icons right">close</i></span>
                    <p>${videoDesc}</p>
                </div>
            </div>
        </div>
        `;
    });
      
    } else if(type === 'searchList') {
      output = `<h4 class="center-align">Results for: ${ui.videoInput.value}</h4>`;
      items.forEach(item => {
        const videoId = item.id.videoId;
        // TODO results output 
        output += `
          <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `
      })
    }
    
    // output videos
    ui.videoContainer.innerHTML = output;
  }

  changeState(state){
    if(state === 'signed-in'){
      this.authorizeButton.style.display = 'none';
      this.signoutButton.style.display = 'block';
      this.content.style.display = 'block';
      this.videoContainer.style.display = 'block';
    } else {
      this.authorizeButton.style.display = 'block';
      this.signoutButton.style.display = 'none';
      this.content.style.display = 'none';
      this.videoContainer.style.display = 'none';
    }
  }
}
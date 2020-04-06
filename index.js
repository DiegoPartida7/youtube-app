let apiKey = "key=AIzaSyCSh_6NfTQ7-Y1iJLJoVOeSS8e32ljV-Nk";
let url = "https://www.googleapis.com/youtube/v3/search?";
let part = "&part=snippet";
let max = "&maxResults=10";
let type = "&type=video";
let PageToken = "";

document.getElementById("searchButton").addEventListener('click', search);

function search(event){
  event.preventDefault();
  let q = document.getElementById("inputText").value.trim();
  console.log("search llamo a findVideo");
  findVideo(q, PageToken);
}

function findVideo(q, PageToken){
  document.getElementById("videosCollection").innerHTML = "";
  console.log(`${url}${apiKey}${part}${max}&q=${q}${type}${PageToken}`);
  fetch(`${url}${apiKey}${part}${max}&q=${q}${type}${PageToken}`)
  .then(response => {
    if( response.ok){
      return response.json();
    };
    throw new Error(response.statusText);
  })
  .then( responseJSON =>{
    console.log("response  llamo a displayResults");

    displayResults(responseJSON,q);
  })
}

function displayResults(data, q){
  console.log(data);
  console.log(data.items.length);

  for (let i = 0; i < data.items.length; i++) {

    document.getElementById("videosCollection").innerHTML += `
      <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
        <img src="${data.items[i].snippet.thumbnails.high.url}"/>
        <h3>
          ${data.items[i].snippet.title}
        </h3>
      </a>
    `;
  }
  if (data.prevPageToken != undefined) {
    let prevPage = document.createElement("button");
    prevPage.innerHTML = "Prev page";
    document.getElementById("videosCollection").appendChild(prevPage);
    prevPage.addEventListener("click", () => {
      findVideo(q, "&pageToken=" + data.prevPageToken);
    });
    
  }
  if (data.items.length == 10) {
    let nextPage = document.createElement("button");
    nextPage.innerHTML = "Next page";
    document.getElementById("videosCollection").appendChild(nextPage);
    nextPage.addEventListener("click", () => {
      findVideo(q, "&pageToken=" + data.nextPageToken);
    });
}
}
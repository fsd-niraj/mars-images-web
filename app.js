const apiKey = '';

let dateInput = document.getElementById('date-input');
const roverSelect = document.getElementById('rover-select');
const cameraSelect = document.getElementById('camera-select');
const rover = roverSelect.value;
const imagesContainer = document.getElementById('images-container');
function getRoverImages() {
  imagesContainer.innerHTML = '<p class="text_center w-100">Loading...</p>';
  let date = dateInput.value;
  const camera = cameraSelect.value;
  let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverSelect.value}/photos?earth_date=${date}&api_key=${apiKey}`;

  if (camera !== '') {
    apiUrl += `&camera=${camera}`;
  }

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        imagesContainer.innerHTML = '';
        const data = JSON.parse(xhr.responseText);
        const photos = data.photos;

        if (photos.length === 0) {
          imagesContainer.innerHTML = '<p class="text_center w-100 color_err">No images found for the selected date, rover, and camera.</p>';
        } else {
          photos.forEach(photo => {
            const imgElement = document.createElement('img');
            imgElement.loading = "lazy"
            imgElement.src = photo.img_src;
            imagesContainer.appendChild(imgElement);
          });
        }
      } else {
        console.error('Error fetching data:', xhr.status);
        imagesContainer.innerHTML = '<p class="text_center w-100 color_err">Error fetching data. Please try again later.</p>';
      }
    }
  };
  xhr.open('GET', apiUrl, true);
  xhr.send();
}

function getRoverData(currentRover = "") {
  const roverName = currentRover.charAt(0).toUpperCase() + currentRover.slice(1);
  let nasaUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=${apiKey}`
  fetch(nasaUrl)
    .then((res) => res.json())
    .then((res) => {
      const data = res.photo_manifest
      dateInput.value = data.max_date
      dateInput.max = data.max_date
    })
    .catch((err) => console.log("ERR:>", err))
}

roverSelect.addEventListener("change", () => {
  getRoverData(roverSelect.value)
})
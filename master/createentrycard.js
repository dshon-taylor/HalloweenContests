// Key Constants for CSV headers
const CONTEST_KEY = "Which contest is this submission for?";
const GROUPTYPE_KEY = "Are you submitting as a group or a department?";
const DEPARTMENTNAME_KEY = "Department/Branch Name";
const GROUPNAMES_KEY = "Participant Names";
const PARTICIPANTNAME_KEY = "Participant's First & Last Name";
const PARTICIPANTDEPARTMENT_KEY = "Participant's Department";
const ENTRYNAME_KEY = "Entry Name";
const PHOTO_KEY = "Submit Your Entry";
const ENTRYID_KEY = "Id";

export function createEntryCard(entry, isWinner = false) {
  const contest = entry[CONTEST_KEY];
  const groupType = entry[GROUPTYPE_KEY];
  const groupDepartment = entry[DEPARTMENTNAME_KEY];
  const groupNames = entry[GROUPNAMES_KEY];
  const participantName = entry[PARTICIPANTNAME_KEY];
  const participantDepartment = entry[PARTICIPANTDEPARTMENT_KEY];
  const entryName = entry[ENTRYNAME_KEY];
  const photo = entry[PHOTO_KEY];
  const entryId = entry[ENTRYID_KEY];

  const photoFilename = decodeURIComponent(photo.split('/').pop());
  const matchedPhoto = `../../images/halloween photos/${photoFilename}`;
  const loadingAttr = isWinner ? 'eager' : 'lazy';
  console.log('Matched photo:', matchedPhoto);

  const entryCard = document.createElement("div");
  entryCard.classList.add("contest-entry");

  if (contest === 'Individual Costume Contest') {
    entryCard.innerHTML = `
      <div class="entry-photo">
          <div class="loader"></div>
          <img src="${matchedPhoto}" loading="${loadingAttr}" />
          <span class="zoom-icon"></span>
      </div>
      <div class="entry-details">
          <h5>${entryName}</h5>
          <p>${participantName} (${participantDepartment})</p>
          <aside>Entry ID: ${entryId}</aside>
      </div>`;
  } else if (contest === 'Pumpkin Contest') {
    entryCard.innerHTML = `
      <div class="entry-photo">
          <div class="loader"></div>
          <img src="${matchedPhoto}" loading="${loadingAttr}" />
          <span class="zoom-icon"></span>
      </div>
      <div class="entry-details">
          <h5>${entryName}</h5>
          <p>${participantName} (${participantDepartment})</p>
          <aside>Entry ID: ${entryId}</aside>
      </div>`;
  } else if (contest === 'Group Costume Contest') {
    entryCard.innerHTML = `
      <div class="entry-photo">
          <div class="loader"></div>
          <img src="${matchedPhoto}" loading="${loadingAttr}" />
          <span class="zoom-icon"></span>
      </div>
      <div class="entry-details">
          <h5>${entryName}</h5>
          <p>${groupType === 'Group' ? groupNames : groupDepartment}</p>
          <aside>Entry ID: ${entryId}</aside>
      </div>`;
  }

  // Remove loader and attach zoom functionality once image loads
  const imgElem = entryCard.querySelector('.entry-photo img');
  const loader = entryCard.querySelector('.loader');
  const zoomIcon = entryCard.querySelector('.zoom-icon');
  const closeZoomIcon = document.getElementById('close-zoom-icon');
  imgElem.style.opacity = '0';

  if (imgElem) {
    imgElem.addEventListener('load', () => {
      // Hide loader once image is loaded
      imgElem.style.opacity = '1';
      if (loader) {
        loader.style.display = 'none';
      }
      
      // Attach zoom event listener only after image loads
      if (zoomIcon) {
        zoomIcon.addEventListener('click', () => {
          const zoomedPhotoDiv = document.getElementById('zoomed-photo');
          const zoomedImg = zoomedPhotoDiv.querySelector('img');
          zoomedImg.src = matchedPhoto;
          zoomedPhotoDiv.style.display = 'grid';
        });
      }
    });
    
    // Handle image load errors
    imgElem.addEventListener('error', () => {
      if (loader) {
        loader.style.display = 'none';
      }
      console.error(`Failed to load image: ${matchedPhoto}`);
    });
  }
  
  // Attach close zoom icon listener (this can be attached immediately)
  if (closeZoomIcon) {
    closeZoomIcon.addEventListener('click', () => {
      const zoomedPhotoDiv = document.getElementById('zoomed-photo');
      const zoomedImg = zoomedPhotoDiv.querySelector('img');
      zoomedPhotoDiv.style.display = 'none';
      zoomedImg.src = '';
    });
  }

  return entryCard;
}
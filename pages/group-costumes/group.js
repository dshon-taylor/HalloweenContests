import { getSubmissions } from '../../master/submissionsData.js';
import { createEntryCard } from '../../master/createEntryCard.js';
import { getVotingLinks } from '../../master/parseVotingLinks.js';
import { getContestWinners } from '../../master/parseVotingWinners.js';

const CONTEST_KEY = "Which contest is this submission for?";
const ENTRYID_KEY = "Id";
const entriesSection = document.getElementById('contest-entries');
const winnersSection = document.getElementById('contest-winners');
const voteButton = document.getElementById('vote-button');

// First, set up the voting link
getVotingLinks().then(links => {
  const votingLink = links.find(link => link["Link Name"] === 'Group Voting URL');
  const isActive = votingLink ? votingLink["Voting Active?"].toLowerCase() === 'true' : false;
  if (votingLink) {
    voteButton.href = votingLink.URL;
  }
  if (votingLink && !isActive) {
    voteButton.classList.add('inactive');
    voteButton.textContent = 'Voting Closed';
  }
}).catch(err => console.error("Error loading voting links:", err));

// Now, load both submissions and winners concurrently
Promise.all([
  getSubmissions(),
  getContestWinners()
]).then(([submissions, winners]) => {
  // Process winners data for the Group Costume Contest
  if (!winners || winners.length === 0) {
    console.error("No contest winners data available.");
    return;
  }
  const contestWinners = winners.find(w => w['Contest Name'] === 'Group Costume Contest');
  if (!contestWinners) {
    console.error("No contest winners for Group Costume Contest found.");
    return;
  }
  const winnerID = contestWinners['1st Place ID'];
  const secondPlaceID = contestWinners['2nd Place ID'];
  const thirdPlaceID = contestWinners['3rd Place ID'];
  let showOnPage = contestWinners['Show Winners?'];
  showOnPage = showOnPage.toLowerCase() === 'show';

  console.log(winnerID, secondPlaceID, thirdPlaceID, showOnPage);

  // Process the winners section
  if (showOnPage) {
    winnersSection.style.display = 'block';
    winnersSection.innerHTML = `
      <h5>THANK YOU to all of our participants!</h5>
      <h3>Please Join Us In Congratulating Our Winners:</h3>
      <div id="winner-entries"></div>`;
  } else {
    winnersSection.style.display = 'none';
  }
  
  let entriesData = submissions;

  // Filter out winners from the main contest entries
  if (showOnPage) {
    entriesData = submissions.filter(entry => {
      const entryID = String(entry[ENTRYID_KEY]).trim();
      return entryID !== String(winnerID).trim() &&
             entryID !== String(secondPlaceID).trim() &&
             entryID !== String(thirdPlaceID).trim();
    });
  }
  
  // Append non-winner entries to the main section
  entriesData.forEach(entry => {
    if (entry[CONTEST_KEY] === 'Group Costume Contest') {
      const card = createEntryCard(entry);
      entriesSection.appendChild(card);
    }
  });
  
  // Function to find and append a winner entry card into the winners section
  function findAndPlaceEntry(entryToFind) {
    // Use the already loaded submissions array
    const foundEntry = submissions.find(entry => entry[ENTRYID_KEY] === entryToFind);
    if (foundEntry) {
      const winnerEntries = document.getElementById('winner-entries');
      const card = createEntryCard(foundEntry);
      winnerEntries.appendChild(card);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
  
  // Append winner cards using the winner IDs
  Promise.all([
    findAndPlaceEntry(winnerID),
    findAndPlaceEntry(secondPlaceID),
    findAndPlaceEntry(thirdPlaceID)
  ]).then(results => {
    // If any winner card wasn't found, hide the winners section and log an error
    if (results.some(found => !found)) {
      winnersSection.style.display = 'none';
      console.log("Winners not found. Check to make sure you have input a correct Entry ID, available on the bottom right of each entry if you hover");
    } else {
      attachBadges();
    }
  });
  
  // Function to attach badges to the winner cards
  function attachBadges() {
    const winnerEntries = document.getElementById('winner-entries');
    const winnerCards = winnerEntries.getElementsByClassName('contest-entry');
    console.log(winnerCards);
    
    if (winnerCards.length >= 3) {
      const firstPlaceBadge = document.createElement('div');
      firstPlaceBadge.classList.add('entry-badge', 'gold');
      firstPlaceBadge.textContent = 'Winner: 1st Place';
      winnerCards[0].querySelector('.entry-details').prepend(firstPlaceBadge);
      
      const secondPlaceBadge = document.createElement('div');
      secondPlaceBadge.classList.add('entry-badge', 'silver');
      secondPlaceBadge.textContent = '2nd Place';
      winnerCards[1].querySelector('.entry-details').prepend(secondPlaceBadge);
      
      const thirdPlaceBadge = document.createElement('div');
      thirdPlaceBadge.classList.add('entry-badge', 'bronze');
      thirdPlaceBadge.textContent = '3rd Place';
      winnerCards[2].querySelector('.entry-details').prepend(thirdPlaceBadge);
    }
  }
}).catch(err => console.error("Error loading data:", err));
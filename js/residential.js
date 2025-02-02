////////////////////////////////////////////////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////

// Set a constant threshold for agent ratings
const AGENT_RATING = 95;

// Initialize an array to store agent data
const agentData = [];

// Define the API endpoint for fetching agents list
const AGENTS_LIST_URL = "http://99.79.77.144:3000/api/agents";

// Get references to HTML elements for table head, table body, and region type select
const AGENT_TABLE_HEAD = document.getElementById('table-head-agent');
const AGENT_TABLE_BODY = document.getElementById('agents-table-body');
const REGION_TYPE_SELECT = document.getElementById('regions');

// Get references to all buttons in the table head
const tableButtons = document.querySelectorAll('th button');

////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////

// Function to render the table body based on agent ratings and selected region
function renderBodyTable() {
  AGENT_TABLE_BODY.innerHTML = '';
  AGENT_TABLE_HEAD.style.backgroundColor = '#A94545';
  const rowNumber = 1;

  for (let AGENT of agents) {
    if (
      AGENT.rating >= AGENT_RATING &&
      (region === 'all' || AGENT.region === region)
    ) {
      let row = `
                <tr>
                    <td>${rowNumber++}</td>
                    <td>${AGENT.first_name}</td>
                    <td>${AGENT.last_name}</td>
                    <td>${AGENT.fee}</td>
                    <td>${AGENT.rating}</td>
                    <td>${AGENT.region}</td>
                </tr>
            `;
      AGENT_TABLE_BODY.innerHTML += row;
    }
  }
  AGENT_TABLE_BODY.innerHTML = AGENT_TABLE_BODY.innerHTML || 'NO AGENT FOUND';
}

////////////////////////////////////////////////////////////////
// EVENT LISTENERS
////////////////////////////////////////////////////////////////

// Event listener for changes in the region type select dropdown
REGION_TYPE_SELECT.addEventListener('change', () => {
  const REGION_TYPE = REGION_TYPE_SELECT.value;
  renderBodyTable(agentData, REGION_TYPE);
});

// Event listeners for sorting table columns by clicking on column headers
tableButtons.forEach((button) => {
  const isCorrectDirection = true;
  button.addEventListener('click', () => {
    const REGION_TYPE = REGION_TYPE_SELECT.value;
    const BUTTON_ID = button.id;

    // Sort agent data based on the selected column
    agentData.sort((a, b) => {
      let compareValue = (prop) =>
        (isCorrectDirection ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1;

      if (BUTTON_ID === 'first_name') return compareValue('first_name');
      if (BUTTON_ID === 'last_name') return compareValue('last_name');
      if (BUTTON_ID === 'fee') return compareValue('fee');
      if (BUTTON_ID === 'rating') return compareValue('rating');
    });

    // Render the table with the sorted data
    renderBodyTable(agentData, REGION_TYPE);
    isCorrectDirection = !isCorrectDirection;
  });
});

////////////////////////////////////////////////////////////////
// INITIALIZATIONS
////////////////////////////////////////////////////////////////

// On window load, fetch agent data and render the table for all regions
window.onload = async () => {
  const RESPONSE = await fetch(AGENTS_LIST_URL);
  agentData = await RESPONSE.json();
  renderBodyTable(agentData, 'all');
};
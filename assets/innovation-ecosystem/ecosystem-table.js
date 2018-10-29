---
# This front matter is required for https://github.com/babel/jekyll-babel
---

() => {

// The Google sheet that holds the data, it must be "published"
// See https://support.google.com/docs/answer/183965
const fetchInnovations = fetchGoogleSheet({
  spreadsheet: '1EVbCg544KBRgjUakLSxeMrXnOtdj1MxwQKI-_3MsooM',
  worksheet: 'oyoam0z'
});

// Set up some datatables (https://datatables.net) defaults
$.extend( true, $.fn.dataTable.defaults, {
  pageLength: 30,
  lengthChange: false,
  dom: 'lrtip'
} );
let table;

/**
 * updateLength - Update the table's pagination length
 *
 * @param {object} ev Change event
 *
 * @returns {object} DataTable
 */
const updateLength = ev => {
  const length = ev.target.value || '30';
  return table.page.len( length ).draw();
};
document.getElementById( 'projects-length' )
        .addEventListener( 'change', updateLength );

/**
 * updateSearch - Filter the table rows by the contents of the search box
 *
 * @param {object} ev Keyup event
 *
 * @returns {object} DataTable
 */
const updateSearch = ev => {
  const query = ev.target.value;
  return table.search( query ).draw();
};
document.getElementById( 'projects-search' )
        .addEventListener( 'keyup', updateSearch );

// Prevent search form from submitting
document.getElementById( 'projects-search-form' )
        .addEventListener( 'submit', ev => ev.preventDefault() );

/**
 * createDataTable - Create the HTML table of data once it arrives
 *
 * @param {array} data Raw data from the spreadsheet
 *
 * @return {object} DataTable
 */
const createDataTable = data => {
  const tbody = document.getElementById('projects-list');
  data.feed.entry.forEach( entry => {
    const tr = document.createElement('tr');
    // These hideous cell names are auto-created by Google sheets
    const cells = [
      entry.gsx$innovation.$t,
      entry.gsx$branchofgovernment.$t,
      entry.gsx$department.$t,
      entry.gsx$agencybureau.$t,
      entry.gsx$yearcreated.$t,
      entry.gsx$descriptionwhatmakesthisinnovative.$t,
      entry.gsx$transformationelementprinciplesplayspeoplepolicyprocesstechnology.$t,
      entry.gsx$category1programsandinitiatives2teamsandcouncils3productsandservices.$t
    ];
    cells.forEach( cell => {
      const td = document.createElement('td');
      td.innerText = cell;
      tr.appendChild( td );
    } );
    // If the innovation doesn't have a name, description, type or category don't include it
    if ( cells[0] !== '' && cells[5] !== '' && cells[6] !== '' && cells[7] !== '' ) {
      tbody.appendChild( tr );
    }
  } );
  table = $('#projects').DataTable();
  return table;
};

// Ensure all resources have finished loading before doing anything
const init = () => fetchInnovations.done( createDataTable );
window.addEventListener( 'load', init );

}();

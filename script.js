let myLeads = []
const leadInputEl = document.getElementById("lead-input-el")
const saveLeadBtn = document.getElementById("save-lead-btn")
const leadsList = document.getElementById("leads-list")
const deleteBtn = document.getElementById("delete-btn")
const saveTab = document.getElementById("save-tab")
const leadsFromLocalStorage = JSON.parse(window.localStorage.getItem("myLeads"))

if(leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage
   render(myLeads)
}

function handleEvents() {
  myLeads.push(leadInputEl.value);
  leadInputEl.value = ""
  localStorage.setItem("myLeads", JSON.stringify(myLeads))
   render(myLeads)
}

function  render(leads) {
  let links = ""
  for (let i = 0; i < leads.length; i++) {
    links += `
      <li class='lead-item'>
        <a href='${leads[i]}' target='_blank'>${leads[i]}</a>
      </li>
    `
  }
  leadsList.innerHTML = links;
}

saveLeadBtn.addEventListener("click", handleEvents)
leadInputEl.addEventListener("keydown", (event)=> {
  if(event.key == 'Enter') {
    event.preventDefault()
    handleEvents()
  }
})

saveTab.addEventListener("click", ()=> {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs)=> {
    myLeads.push(tabs[0].url)
    window.localStorage.setItem("myLeads", JSON.stringify(myLeads))
     render(myLeads)
  })
})

deleteBtn.addEventListener("dblclick", ()=> {
  localStorage.removeItem("myLeads")
  myLeads = []
   render(myLeads)
})

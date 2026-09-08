let myLeads = []
const leadInputEl = document.getElementById("lead-input-el")
const saveLeadBtn = document.getElementById("save-lead-btn")
const leadsList = document.getElementById("leads-list")
const deleteBtn = document.getElementById("delete-btn")
const saveTab = document.getElementById("save-tab")
const leadsFromLocalStorage = JSON.parse(window.localStorage.getItem("myLeads"))

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage
  render(myLeads)
}

function persist() {
  localStorage.setItem("myLeads", JSON.stringify(myLeads))
}

function faviconFor(url) {
  try {
    const { origin } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`
  } catch {
    return ""
  }
}

function render(leads) {
  let links = ""
  for (let i = 0; i < leads.length; i++) {
    const url = leads[i]
    links += `
      <li class='lead-item'>
        <img class='lead-item__favicon' src='${faviconFor(url)}' alt='' onerror="this.style.visibility='hidden'">
        <a href='${url}' target='_blank' title='${url}'>${url}</a>
        <button class='lead-item__remove' data-index='${i}' title='Remove' aria-label='Remove'>&times;</button>
      </li>
    `
  }
  leadsList.innerHTML = links
}

function addLead(url) {
  if (!url) return
  myLeads.push(url)
  persist()
  render(myLeads)
}

saveLeadBtn.addEventListener("click", () => {
  addLead(leadInputEl.value.trim())
  leadInputEl.value = ""
})

leadInputEl.addEventListener("keydown", (event) => {
  if (event.key == 'Enter') {
    event.preventDefault()
    addLead(leadInputEl.value.trim())
    leadInputEl.value = ""
  }
})

saveTab.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    addLead(tabs[0].url)
  })
})

deleteBtn.addEventListener("dblclick", () => {
  localStorage.removeItem("myLeads")
  myLeads = []
  render(myLeads)
})

leadsList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".lead-item__remove")
  if (!removeBtn) return
  const index = Number(removeBtn.dataset.index)
  myLeads.splice(index, 1)
  persist()
  render(myLeads)
})

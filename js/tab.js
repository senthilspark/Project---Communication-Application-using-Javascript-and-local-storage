// Initialize tabs when script loads
(function() {
  // Function to initialize the tabs
  function initializeTabs() {
    const tabBar = document.getElementById("tab-bar");
    if (!tabBar) {
      console.error("Element with ID 'tab-bar' not found");
      return;
    }
    
    tabBar.innerHTML = `<tbody class="tab">
      <tr>
        <td id="chat_tab">
          <button
            class="link-button"
            onclick="chatlist_page()"
            type="button"
          >
            Group Chat
          </button>
        </td>
        <td id="user_tab">
          <button
            class="link-button"
            onclick="userlist_page()"
            type="button"
          >
            Manage Users
          </button>
        </td>
        <td id="document_tab">
          <button
            class="link-button"
            onclick="documentlist_page()"
            type="button"
          >
            Manage Documents
          </button>
        </td>
        <td id="logout_tab">
          <button
            class="link-button"
            onclick="location.href='./Welcome.html'"
            type="button"
          >
            Logout
          </button>
        </td>
      </tr>
    </tbody>`;

    // Set tab colors
    setTabColors();
    
    // Set active tab based on current page
    setActiveTabBasedOnCurrentPage();
  }

  function setTabColors() {
    const tabs = ['logout_tab', 'user_tab', 'document_tab', 'chat_tab'];
    tabs.forEach(tabId => {
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.style.backgroundColor = "lightgray";
        // set the link button to gray as well
        const button = tab.querySelector('.link-button')
        button.style.backgroundColor = "lightgray";
      }
    });
  }

  // Function to set active tab based on current page
  function setActiveTabBasedOnCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
    console.log('Current page:', currentPage); // Debug log
    
    if (currentPage.includes('Chatlist') || currentPage.includes('6_Chatlist')) {
      console.log('Setting chat tab active'); // Debug log
      setActiveTab('chat_tab');
    } else if (currentPage.includes('Userlist') || currentPage.includes('7_Userlist')) {
      console.log('Setting user tab active'); // Debug log
      setActiveTab('user_tab');
    } else if (currentPage.includes('Documentlist') || currentPage.includes('9_Documentlist')) {
      console.log('Setting document tab active'); // Debug log
      setActiveTab('document_tab');
    }
    // LoginSuccess.html and Welcome.html don't have an active tab
  }

  // Function to reset all tabs and set selected tab as transparent
  function setActiveTab(activeTabId) {
    const tabs = ['logout_tab', 'user_tab', 'document_tab', 'chat_tab'];
    tabs.forEach(tabId => {
      const tab = document.getElementById(tabId);
      if (tab) {
        const button = tab.querySelector('.link-button');
        if (tabId === activeTabId) {
          // Make selected tab transparent
          tab.style.backgroundColor = "transparent";
          button.style.backgroundColor = "transparent";
        } else {
          // Make other tabs gray
          tab.style.backgroundColor = "lightgray";
          button.style.backgroundColor = "lightgray";
        }
      }
    });
  }

  // Make setActiveTab available globally
  window.setActiveTab = setActiveTab;

  // Initialize immediately since script is at bottom of page
  initializeTabs();
})();

function chatlist_page() {
  setActiveTab('chat_tab');
  location.href = "./Chatlist.html";
}

function userlist_page() {
  setActiveTab('user_tab');
  location.href = "./Userlist.html";
}

function documentlist_page() {
  setActiveTab('document_tab');
  location.href = "./Documentlist.html";
}

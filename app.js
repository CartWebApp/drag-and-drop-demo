const list = document.getElementById('todo-list');

// INITIALIZE LIST FROM LOCAL STORAGE OR DOM
function initializeList() {
  const savedOrder = localStorage.getItem('todo-order');
  
  if (savedOrder) {
    // Restore from local storage
    const order = JSON.parse(savedOrder);
    order.forEach(({ id }) => {
      const item = document.getElementById(id);
      if (item) {
        list.appendChild(item);
      }
    });
    console.log("List restored from local storage");
  } else {
    // Load from DOM and save to local storage
    const currentOrder = saveOrder();
    localStorage.setItem('todo-order', JSON.stringify(currentOrder));
    console.log("List initialized from DOM and saved to local storage");
  }
}

// Initialize on page load
initializeList();

// HANDLE DRAG START
list.addEventListener('dragstart', (event) => {
  if (!event.target.classList.contains('item')) return; // Ensure we're dragging an item
  
  event.target.classList.add('dragging');

  // Customizing the ghost image
  const ghost = event.target.cloneNode(true);
  ghost.style.backgroundColor = "lightblue";
  ghost.style.position = "absolute";
  ghost.style.left = "-9999px"; // Hide the actual clone from view
  document.body.appendChild(ghost);
  
  event.dataTransfer.setDragImage(ghost, 0, 0);
  setTimeout(() => ghost.remove(), 0);
});

// REORDERING LOGIC
list.addEventListener('dragover', (event) => {
  event.preventDefault(); // Required to allow a drop
  
  const draggingItem = document.querySelector('.dragging');
  // Get all items except the one being dragged
  const siblings = [...list.querySelectorAll('.item:not(.dragging)')];

  // Find the sibling the mouse is currently hovering over
  let nextSibling = siblings.find(sibling => {
    const box = sibling.getBoundingClientRect();
    // Check if mouse position is above the vertical midpoint of the sibling
    return event.clientY <= box.top + box.height / 2;
  });

  // Physically move the element in the DOM
  list.insertBefore(draggingItem, nextSibling);
});

// HANDLE DRAG END
list.addEventListener('dragend', (event) => {
  event.target.classList.remove('dragging');
  
  const newOrder = saveOrder();
  console.log("New Task Order:", newOrder);
  localStorage.setItem('todo-order', JSON.stringify(newOrder));
});

// Capture Current State
function saveOrder() {
  const items = [...list.querySelectorAll('.item')];
  return items.map(item => ({
    id: item.id,
    task: item.querySelector('span')?.innerText.trim() || item.innerText.trim()
  }));
}
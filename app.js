const list = document.getElementById('todo-list');

// HANDLE DRAG START
list.addEventListener('dragstart', (event) => {
  if (!event.target.classList.contains('item')) return; // Ensure we're dragging an item
  
  event.target.classList.add('dragging');

  // Customizing the ghost image
  const ghost = event.target.cloneNode(true);
  ghost.style.backgroundColor = "lightblue";
  ghost.style.position = "absolute";
  ghost.style.top = "-1000px"; // Hide the actual clone from view
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
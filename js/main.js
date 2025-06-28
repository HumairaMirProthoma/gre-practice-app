// Toggle dropdown when clicking hamburger
document.getElementById('hamburger').addEventListener('click', function(event) {
  event.stopPropagation(); // stop click from closing menu
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});

// Close dropdown when clicking anywhere else
document.addEventListener('click', function() {
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = 'none';
});
